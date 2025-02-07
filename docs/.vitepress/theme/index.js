import DefaultTheme from 'vitepress/theme'

import NvIcon from '@nova-ui/components/icon'
import '@nova-ui/theme-chalk/src/index.scss';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(NvIcon) // 在vitepress中注册全局组件
  }
}
