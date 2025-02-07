import { withInstall } from '@nova-ui/utils/with-install'
import _FormItem from './src/form-item.vue'
import _Form from './src/form.vue'

const FormItem = withInstall(_FormItem)
const Form = withInstall(_Form)

export { FormItem, Form }
export * from './src/form-item'
export * from './src/form'

export type FormInstanceType = InstanceType<typeof Form>
export type FormItemInstanceType = InstanceType<typeof FormItem>
declare module 'vue' {
  export interface GlobalComponents {
    NvFormItem: typeof FormItem
    NvForm: typeof Form
  }
}
