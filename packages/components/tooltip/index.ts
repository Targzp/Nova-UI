import { withInstall } from '@nova-ui/utils/with-install'
import _Tooltip from './src/tooltip.vue'

const Tooltip = withInstall(_Tooltip)

export {
  Tooltip
}
export default Tooltip

export * from './src/tooltip'

declare module 'vue' {
  export interface GlobalComponents {
    NvTooltip: typeof Tooltip
  }
}