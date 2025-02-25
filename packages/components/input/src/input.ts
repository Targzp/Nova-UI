import { ExtractPropTypes, PropType } from 'vue'

export const inputProps = {
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [Number, String] as PropType<number | string>,
    default: ''
  },
  placeholder: {
    type: String
  },
  clearable: {
    type: Boolean
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  label: {
    type: String
  }
} as const

export const inputEmits = {
  'update:modelValue': (value: string) => value,
  input: (value: string) => value,
  change: (value: string) => value,
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear: () => true // 清空事件
}

export type inputEmits = typeof inputEmits

export type InputProps = Partial<ExtractPropTypes<typeof inputProps>>
