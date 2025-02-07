import type { RuleItem, Values } from 'async-validator'
import { ExtractPropTypes, InjectionKey, PropType } from 'vue'

export type Arrayable<T> = T | T[]

export type ValidCallback = (valid: boolean, fields?: Values) => void

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>
}

export const formItemValidateState = ['success', 'error', ''] as const
export type FormItemValidateState = (typeof formItemValidateState)[number]

export const formItemProps = {
  prop: String,
  label: String,
  rules: [Object, Array] as PropType<Arrayable<FormItemRule>>,
  showMessage: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 'auto'
  }
} as const

export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>

export interface FormItemContxt extends FormItemProps {
  validate: (trigger: string, callback?: ValidCallback) => Promise<void>
  clearValidate: () => void
}

export const formItemContextKey: InjectionKey<FormItemContxt> = Symbol()
