import { withInstall } from '@nova-ui/utils/with-install'
import _Input from './src/input.vue'

const Input = withInstall(_Input)

export {
  Input
}
export default Input

export * from './src/input'

declare module 'vue' {
  export interface GlobalComponents {
    NvInput: typeof Input
  }
}
