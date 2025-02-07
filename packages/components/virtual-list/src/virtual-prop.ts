import { ExtractPropTypes } from 'vue'

export const virtualProps = {
  // 单个行高
  size: {
    type: Number,
    default: 35
  },
  // 可见的行数
  remain: {
    type: Number,
    default: 8
  },
  items: {
    type: Array,
    default: () => []
  }
} as const

export type VirtualProps = Partial<ExtractPropTypes<typeof virtualProps>>
