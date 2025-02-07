// 用来整合组件的 最终实现导出组件
import { withInstall } from '@nova-ui/utils/with-install'
import _Icon from './src/icon.vue'

const Icon = withInstall(_Icon)

export {
  Icon
}
export default Icon // 可以通过 app.use 来使用，也可以通过 import 方式单独使用

export * from './src/icon'

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    NvIcon: typeof Icon
  }
}
