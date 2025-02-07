import { withInstall } from '@nova-ui/utils/with-install'
import _Tree from './src/tree.vue'

const Tree = withInstall(_Tree)

export { Tree }
export default Tree

export * from './src/tree'

declare module 'vue' {
  export interface GlobalComponents {
    NvTree: typeof Tree
  }
}
