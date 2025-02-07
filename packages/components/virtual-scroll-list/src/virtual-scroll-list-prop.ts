import { DefineComponent, ExtractPropTypes, PropType } from 'vue'

export type RangeOptions = {
  start: number,
  end: number,
  padFront: number,
  padBehind: number
}

export type VirtualOptions = {
  keeps: number,
  buffer: number,
  estimateSize: number
  uniqueIds: string[]
}

export type UpdateFuncType = (range: RangeOptions) => void

export const virtualScrollListProps = {
  dataSources: {
    type: Array as PropType<Record<string, unknown>[]>,
    required: true,
    default: () => []
  },
  dataKey: {
    type: String,
    required: true
  },
  keeps: {
    type: Number,
    default: 30
  },
  estimateSize: {
    type: Number,
    default: 80
  },
  dataComponent: {
    type: [Object, Function] as PropType<DefineComponent>,
    required: true
  }
} as const

export const virtualItemProps = {
  uniqueKey: {
    type: [String, Number] as PropType<string | number>,
  },
  source: {
    type: Object,
    required: true
  },
  component: {
    type: [Object, Function] as PropType<DefineComponent>,
    required: true
  }
}

export type VirtualScrollListProps = ExtractPropTypes<typeof virtualScrollListProps>

export type VirtualScrollItemProps = ExtractPropTypes<typeof virtualItemProps>
