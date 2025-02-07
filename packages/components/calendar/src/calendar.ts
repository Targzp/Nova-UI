import { ExtractPropTypes, PropType } from 'vue'

export type CalendarDateCellType = 'prev' | 'current' | 'next'

export type CalendarDateType = 'prev-year' | 'prev-month' | 'next-year' | 'next-month' | 'today'

export type CalendarDateCell = {
  text: number
  type: CalendarDateCellType
}

export const calendarProps = {
  modelValue: {
    type: Date
  },
  range: {
    type: Array as unknown as PropType<[Date, Date]>
  }
} as const

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

// 事件相关的类型
export const calendarEmits = {
  'update:modelValue': (val: Date) => val instanceof Date
}

export type CalendarEmits = typeof calendarEmits
