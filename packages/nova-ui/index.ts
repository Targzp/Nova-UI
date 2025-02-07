import { Icon, Button } from '../nova-ui'
import type { App } from 'vue'

const components = [Icon, Button]

const install = (app: App) => {
  components.forEach(component => {
    app.use(component)
  })
}

export default {
  install
}

export * from '../components'
