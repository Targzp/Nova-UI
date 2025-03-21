import { ExtractPropTypes, InjectionKey, PropType } from 'vue'
import { Arrayable, FormItemContxt, FormItemRule } from './form-item'

export const formProps = {
  model: Object,
  rules: {
    type: Object as PropType<Record<string, Arrayable<FormItemRule>>>
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 'auto'
  },
  inline: {
    type: Boolean,
    default: false
  },
  // 	是否隐藏必填字段标签旁边的红色星号
  hideRequiredAsterisk: {
    type: Boolean,
    default: false
  }
} as const

export type FormProps = Partial<ExtractPropTypes<typeof formProps>>

export interface FormContext extends FormProps {
  addField: (field: FormItemContxt) => void
  clearValidate: () => void
  resetFields: () => void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol()
