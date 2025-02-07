import { withInstall } from '@nova-ui/utils/with-install'
import _Button from './src/button.vue'

const Button = withInstall(_Button)

export {
  Button
}
export default Button

export * from './src/button'

declare module 'vue' {
  export interface GlobalComponents {
    NvButton: typeof Button
  }
}
