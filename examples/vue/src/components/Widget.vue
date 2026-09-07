<template>
  <Widget :config="config" />
</template>

<script lang="ts">
// This is a React component
import { De1Widget } from '@de1/widget'
import { applyPureReactInVue } from 'veaury'

export default {
  components: {
    // Use HOC 'applyReactInVue' or 'applyPureReactInVue'
    // Basic: applyReactInVue(De1Widget),
    Widget: applyPureReactInVue(De1Widget),
  },
  setup() {
    return {
      config: {
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
        integrator: 'vue-example',
      },
    }
  },
}
</script>
