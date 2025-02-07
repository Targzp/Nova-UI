import { ExtractPropTypes, PropType } from 'vue'

export const checkboxProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>
  },
  disabled: Boolean,
  indeterminate: Boolean,
  label: {
    type: String as PropType<string>
  }
} as const

export const checkboxEmits = {
  'update:modelValue': (value: boolean | string | number) => value,
  change: (value: boolean) => value
}

export type CheckboxEmits = typeof checkboxEmits

export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>
