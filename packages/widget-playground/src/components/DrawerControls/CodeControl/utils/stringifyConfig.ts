import type { WidgetConfig } from '@de1/widget'
import { cloneStructuredConfig } from '../../../../utils/cloneStructuredConfig'
import { substituteFunctions } from '../../../../utils/substituteFunctions'
import { addFunctionsAsStrings } from './addFunctionsAsStrings'

const configTemplate = (config?: string) =>
  config ? `const config = ${config}` : undefined

export function stringifyConfig(
  config: Partial<WidgetConfig>,
  template = configTemplate
) {
  const clonedConfig = cloneStructuredConfig(config)

  const functionsReferences = substituteFunctions(clonedConfig, 'id')

  const stringifiedConfig = addFunctionsAsStrings(
    JSON.stringify(clonedConfig, null, 2),
    functionsReferences
  )

  const templatedCode = template(
    stringifiedConfig
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/(^|\s|,)(\.([a-zA-Z0-9_\-]+)):/g, '$1"$2":')
  )
  
  return templatedCode ? templatedCode : undefined
}
