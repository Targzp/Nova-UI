import { withInstall } from '@nova-ui/utils/with-install'
import _VirtualScrollList from './src/virtual-scroll-list'

const VirtualScrollList = withInstall(_VirtualScrollList)

export {
  VirtualScrollList
}
export default VirtualScrollList

export type { VirtualScrollListProps } from './src/virtual-scroll-list-prop'

declare module 'vue' {
  export interface GlobalComponents {
    NvVirtualScrollList: typeof VirtualScrollList
  }
}
