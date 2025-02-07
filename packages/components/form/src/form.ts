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
  }
} as const

export type FormProps = Partial<ExtractPropTypes<typeof formProps>>

export interface FormContext extends FormProps {
  addField: (field: FormItemContxt) => void
  clearValidate: () => void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol()
