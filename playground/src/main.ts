import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Icon from '@nova-ui/components/icon'
import Tree from '@nova-ui/components/tree'
import Checkbox from '@nova-ui/components/checkbox'
import Button from '@nova-ui/components/button'
import Input from '@nova-ui/components/Input'
import Tooltip from '@nova-ui/components/tooltip'
import { FormItem, Form } from '@nova-ui/components/form'
import Upload from '@nova-ui/components/upload'
import Calendar from '@nova-ui/components/calendar'
import VirtualScrollList from '@nova-ui/components/virtual-scroll-list'
import '@nova-ui/theme-chalk/src/index.scss'

const plugins = [
  Icon,
  Tree,
  Checkbox,
  Button,
  Input,
  FormItem,
  Form,
  Upload,
  Calendar,
  VirtualScrollList,
  Tooltip
]

const app = createApp(App)

plugins.forEach(plugin => app.use(plugin)) // 将组件注册成了全局组件，可以直接使用了

app.mount('#app')
