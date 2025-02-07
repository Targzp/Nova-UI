import { withInstall } from '@nova-ui/utils/with-install'
import _Checkbox from './src/checkbox.vue'

const Checkbox = withInstall(_Checkbox)

export { Checkbox }
export default Checkbox

export * from './src/checkbox'

declare module 'vue' {
  export interface GlobalComponents {
    NvCheckbox: typeof Checkbox
  }
}
