import { withInstall } from '@nova-ui/utils/with-install'
import _Virtual from './src/virtual'

const VirtualList = withInstall(_Virtual)

export { VirtualList }
export default VirtualList

export * from './src/virtual'

declare module 'vue' {
  export interface GlobalComponents {
    NvVirtualList: typeof VirtualList
  }
}
