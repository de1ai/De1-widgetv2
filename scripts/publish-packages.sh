#!/usr/bin/env zsh

# 一键发布 De¹ Exchange Widget 相关 npm 包
#
# 发布顺序（按依赖关系）:
#   1. widget-types
#   2. widget-sdk
#   3. wallet-management (即 widget-management)
#   4. widget
#
# 用法:
#   ./scripts/publish-packages.sh [选项]
#
# 选项:
#   --merge-branch <branch>   要合并的分支，默认 feature/bridge-de1
#   --bump <patch|minor|major> 版本号递增类型，默认 patch
#   --skip-merge              跳过合并步骤
#   --skip-login              跳过 npm login
#   --dry-run                 仅分析变更，不实际构建和发布
#   -h, --help                显示帮助

set -e
set -u
set -o pipefail

# ─── 颜色 ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}ℹ${NC}  $*"; }
log_success() { echo -e "${GREEN}✅${NC} $*"; }
log_warn()    { echo -e "${YELLOW}⚠${NC}  $*"; }
log_error()   { echo -e "${RED}❌${NC} $*" >&2; }
log_step()    { echo -e "\n${CYAN}━━━ $* ━━━${NC}"; }

# ─── 配置 ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="${0:A:h}"
PROJECT_ROOT="${SCRIPT_DIR:h}"

MERGE_BRANCH="feature/bridge-de1"
BUMP_TYPE="patch"
SKIP_MERGE=false
SKIP_LOGIN=false
DRY_RUN=false

# 包定义（按依赖顺序排列）
typeset -a PACKAGE_KEYS
PACKAGE_KEYS=(widget-types widget-sdk wallet-management widget)

typeset -a PACKAGE_DIRS
PACKAGE_DIRS=(widget-types widget-sdk wallet-management widget)

typeset -a PACKAGE_NAMES
PACKAGE_NAMES=(
  "@de1/widget-types"
  "@de1/widget-sdk"
  "@de1/wallet-management"
  "@de1/widget"
)

# 各包依赖的内部包
typeset -A PACKAGE_INTERNAL_DEPS
PACKAGE_INTERNAL_DEPS=(
  "widget-sdk"          "@de1/widget-types"
  "wallet-management"   "@de1/widget-sdk"
  "widget"              "@de1/wallet-management @de1/widget-sdk"
)

# 记录本次发布的新版本号
typeset -A NEW_VERSIONS

# ─── 参数解析 ────────────────────────────────────────────────────────────────
usage() {
  sed -n '3,18p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --merge-branch) MERGE_BRANCH="$2"; shift 2 ;;
    --bump)         BUMP_TYPE="$2"; shift 2 ;;
    --skip-merge)   SKIP_MERGE=true; shift ;;
    --skip-login)   SKIP_LOGIN=true; shift ;;
    --dry-run)      DRY_RUN=true; shift ;;
    -h|--help)      usage ;;
    *) log_error "未知参数: $1"; usage ;;
  esac
done

if [[ ! "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  log_error "无效的 bump 类型: $BUMP_TYPE（仅支持 patch / minor / major）"
  exit 1
fi

# ─── 工具函数 ────────────────────────────────────────────────────────────────
get_package_index() {
  local key="$1"
  local i
  for i in {1..${#PACKAGE_KEYS[@]}}; do
    if [[ "${PACKAGE_KEYS[$i]}" == "$key" ]]; then
      echo "$((i))"
      return 0
    fi
  done
  return 1
}

get_package_version() {
  local dir="$1"
  node -p "require('$PROJECT_ROOT/packages/$dir/package.json').version"
}

bump_package_version() {
  local dir="$1"
  local bump="$2"
  (
    cd "$PROJECT_ROOT/packages/$dir"
    npm version "$bump" --no-git-tag-version > /dev/null
    node -p "require('./package.json').version"
  )
}

update_internal_deps() {
  local dir="$1"
  local key="$2"
  local deps="${PACKAGE_INTERNAL_DEPS[$key]:-}"
  local pkg_path="$PROJECT_ROOT/packages/$dir/package.json"
  local dep_name new_ver

  [[ -z "$deps" ]] && return 0

  for dep_name in ${=deps}; do
    new_ver="${NEW_VERSIONS[$dep_name]:-}"
    [[ -z "$new_ver" ]] && continue

    node -e "
      const fs = require('fs');
      const pkgPath = process.argv[1];
      const depName = process.argv[2];
      const version = process.argv[3];
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.dependencies && pkg.dependencies[depName]) {
        pkg.dependencies[depName] = '^' + version;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
        console.log('  更新依赖: ' + depName + ' -> ^' + version);
      }
    " "$pkg_path" "$dep_name" "$new_ver"
  done
}

# 分析 git diff，返回有变更的包 key
detect_changed_packages() {
  local base_ref="$1"
  local changed_dirs
  local key idx dir

  # grep 无匹配时返回 1，需避免 pipefail 导致脚本静默退出
  changed_dirs=$(git -C "$PROJECT_ROOT" diff --name-only "$base_ref" HEAD \
    | { grep '^packages/' || true; } \
    | sed 's|packages/||' \
    | cut -d'/' -f1 \
    | sort -u)

  [[ -z "$changed_dirs" ]] && return 0

  for key in "${PACKAGE_KEYS[@]}"; do
    idx=$(get_package_index "$key")
    dir="${PACKAGE_DIRS[$idx]}"
    if echo "$changed_dirs" | grep -Fxq "$dir" 2>/dev/null; then
      echo "$key"
    fi
  done
}

# 根据变更包计算需要发布的包列表（含下游级联）
compute_publish_list() {
  local -a changed=("$@")
  local min_idx=999
  local key idx i

  for key in "${changed[@]}"; do
    idx=$(get_package_index "$key") || continue
    [[ "$idx" -lt "$min_idx" ]] && min_idx="$idx"
  done

  if [[ "$min_idx" -eq 999 ]]; then
    return 0
  fi

  for ((i = min_idx; i <= ${#PACKAGE_KEYS[@]}; i++)); do
    echo "${PACKAGE_KEYS[$i]}"
  done
}

restore_package_json_if_needed() {
  local dir="$1"
  local pkg_dir="$PROJECT_ROOT/packages/$dir"

  node -e "
    const fs = require('fs');
    const path = require('path');
    const pkgDir = process.argv[1];
    const pkgPath = path.join(pkgDir, 'package.json');
    const tmpPath = path.join(pkgDir, 'package.json.tmp');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (pkg.scripts) process.exit(0);
    if (!fs.existsSync(tmpPath)) {
      console.error('package.json 缺少 scripts，且找不到 package.json.tmp 备份');
      process.exit(1);
    }

    const tmp = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
    tmp.version = pkg.version;
    if (pkg.dependencies) {
      tmp.dependencies = { ...tmp.dependencies, ...pkg.dependencies };
    }
    fs.writeFileSync(pkgPath, JSON.stringify(tmp, null, 2) + '\n');
    console.log('  已从 package.json.tmp 恢复 scripts（保留当前版本 v' + pkg.version + '）');
  " "$pkg_dir"
}

build_package() {
  local dir="$1"
  local key="$2"

  cd "$PROJECT_ROOT/packages/$dir"
  restore_package_json_if_needed "$dir"
  log_info "进入 packages/$dir 执行构建..."
  log_info "执行 npm run build..."
  npm run build
}

prepare_for_publish() {
  local dir="$1"
  local key="$2"

  cd "$PROJECT_ROOT/packages/$dir"

  # build:prerelease 会移除 scripts 字段，必须在 build 完成后再执行
  if [[ "$key" == "widget" || "$key" == "wallet-management" ]]; then
    log_info "执行 build:prerelease（格式化 package.json 用于发布）..."
    npm run build:prerelease
  fi
}

publish_package() {
  local dir="$1"
  local key="$2"
  local idx name

  idx=$(get_package_index "$key")
  name="${PACKAGE_NAMES[$idx]}"

  cd "$PROJECT_ROOT/packages/$dir"

  if [[ "$DRY_RUN" == true ]]; then
    log_warn "[dry-run] 将发布 $name@$(get_package_version "$dir")"
    return 0
  fi

  prepare_for_publish "$dir" "$key"

  log_info "执行 npm publish --access public ..."
  if npm publish --access public; then
    publish_ok=true
  else
    publish_ok=false
  fi

  # 无论发布成功与否，都恢复 package.json
  if [[ "$key" == "widget" || "$key" == "wallet-management" ]]; then
    if (cd "$PROJECT_ROOT/packages/$dir" && node ../../scripts/postrelease.js 2>/dev/null); then
      log_info "已恢复 package.json"
    fi
  fi

  if [[ "$publish_ok" != true ]]; then
    log_error "发布失败: $name"
    exit 1
  fi

  log_success "已发布 $name@$(get_package_version "$dir")"
}

# ─── 主流程 ──────────────────────────────────────────────────────────────────
main() {
  local pre_merge_ref="" merge_ref="" confirm relogin
  local -a changed_keys publish_keys
  local key idx dir name old_ver new_ver

  cd "$PROJECT_ROOT"
  log_step "OpenOcean Widget 一键发布"
  log_info "项目根目录: $PROJECT_ROOT"
  log_info "合并分支:   $MERGE_BRANCH"
  log_info "版本递增:   $BUMP_TYPE"
  [[ "$DRY_RUN" == true ]] && log_warn "DRY-RUN 模式：不会实际构建和发布"

  # ── Step 1: 合并 feature/bridge ──
  if [[ "$SKIP_MERGE" == false ]]; then
    log_step "Step 1: 合并 $MERGE_BRANCH"

    if [[ -n "$(git status --porcelain)" ]]; then
      log_error "工作区有未提交的更改，请先 commit 或 stash"
      git status --short
      exit 1
    fi

    log_info "拉取远程最新代码..."
    git fetch origin

    pre_merge_ref="$(git rev-parse HEAD)"
    log_info "合并前 commit: ${pre_merge_ref:0:8}"

    if git show-ref --verify --quiet "refs/remotes/origin/$MERGE_BRANCH"; then
      merge_ref="origin/$MERGE_BRANCH"
    elif git show-ref --verify --quiet "refs/heads/$MERGE_BRANCH"; then
      merge_ref="$MERGE_BRANCH"
    else
      log_error "找不到分支: $MERGE_BRANCH"
      exit 1
    fi

    log_info "合并 $merge_ref ..."
    if ! git merge "$merge_ref" --no-edit; then
      log_error "合并失败，请手动解决冲突后重新运行（可加 --skip-merge 跳过合并）"
      exit 1
    fi
    log_success "合并完成"
  else
    log_warn "跳过合并步骤"

    if git show-ref --verify --quiet "refs/remotes/origin/$MERGE_BRANCH"; then
      pre_merge_ref="origin/$MERGE_BRANCH"
    elif git show-ref --verify --quiet "refs/heads/$MERGE_BRANCH"; then
      pre_merge_ref="$MERGE_BRANCH"
    else
      log_info "本地找不到 $MERGE_BRANCH，尝试 fetch..."
      git fetch origin "$MERGE_BRANCH" 2>/dev/null || true
      if git show-ref --verify --quiet "refs/remotes/origin/$MERGE_BRANCH"; then
        pre_merge_ref="origin/$MERGE_BRANCH"
      else
        log_error "找不到分支: $MERGE_BRANCH"
        exit 1
      fi
    fi
    log_info "对比基准: $pre_merge_ref → HEAD"
  fi

  # ── Step 2: 分析变更包 ──
  log_step "Step 2: 分析变更的包"

  changed_keys=("${(@f)$(detect_changed_packages "$pre_merge_ref")}")
  changed_keys=(${changed_keys:#})  # 过滤空元素

  if [[ ${#changed_keys[@]} -eq 0 ]]; then
    log_warn "以下 4 个包均无代码变更，无需发布:"
    for key in "${PACKAGE_KEYS[@]}"; do
      echo "    - $key"
    done
    log_info "如果仍需强制发布，请手动 bump 版本后使用 --skip-merge 运行"
    exit 0
  fi

  log_info "检测到以下包有变更:"
  for key in "${changed_keys[@]}"; do
    idx=$(get_package_index "$key") || continue
    echo "    - ${PACKAGE_KEYS[$idx]} (${PACKAGE_NAMES[$idx]})"
  done

  publish_keys=("${(@f)$(compute_publish_list "${changed_keys[@]}")}")
  publish_keys=(${publish_keys:#})

  log_info "根据依赖关系，将按顺序发布以下包:"
  for key in "${publish_keys[@]}"; do
    idx=$(get_package_index "$key") || continue
    old_ver=$(get_package_version "${PACKAGE_DIRS[$idx]}")
    echo "    → ${PACKAGE_NAMES[$idx]}  (当前 v$old_ver → bump $BUMP_TYPE)"
  done

  if [[ "$DRY_RUN" == true ]]; then
    log_warn "DRY-RUN 模式结束"
    exit 0
  fi

  echo ""
  read -r "confirm?确认继续发布？[y/N] "
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    log_warn "已取消"
    exit 0
  fi

  # ── Step 3: npm login ──
  log_step "Step 3: npm 登录"

  if [[ "$SKIP_LOGIN" == false ]]; then
    if npm whoami &>/dev/null; then
      log_info "当前已登录 npm 用户: $(npm whoami)"
      read -r "relogin?是否需要重新登录？[y/N] "
      if [[ "$relogin" =~ ^[Yy]$ ]]; then
        npm login
      fi
    else
      log_info "尚未登录 npm，请完成登录..."
      npm login
    fi
    log_success "npm 登录完成: $(npm whoami)"
  else
    log_warn "跳过 npm login"
  fi

  # ── Step 4: 安装依赖 ──
  log_step "Step 4: 安装依赖"
  log_info "执行 pnpm install ..."
  pnpm install

  # ── Step 5: 按依赖顺序 bump → build → publish ──
  log_step "Step 5: 构建并发布"

  for key in "${publish_keys[@]}"; do
    idx=$(get_package_index "$key")
    dir="${PACKAGE_DIRS[$idx]}"
    name="${PACKAGE_NAMES[$idx]}"
    old_ver=$(get_package_version "$dir")

    echo ""
    log_step "处理 $name"

    log_info "检查并更新内部依赖..."
    update_internal_deps "$dir" "$key"

    log_info "版本号: v$old_ver → bump $BUMP_TYPE"
    new_ver=$(bump_package_version "$dir" "$BUMP_TYPE")
    NEW_VERSIONS[$name]="$new_ver"
    log_success "新版本: v$new_ver"

    build_package "$dir" "$key"
    publish_package "$dir" "$key"
  done

  # ── 完成 ──
  log_step "发布完成"
  echo ""
  log_success "本次发布的包及版本:"
  for key in "${publish_keys[@]}"; do
    idx=$(get_package_index "$key")
    name="${PACKAGE_NAMES[$idx]}"
    echo "    ${name}@${NEW_VERSIONS[$name]}"
  done
  echo ""
  log_warn "请记得提交版本号变更:"
  echo "    git add packages/"
  echo "    git commit -m \"chore: release packages\""
}

main "$@"
