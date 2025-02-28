import { ExtractPropTypes, PropType } from 'vue'
import type { Placement, Options } from '@popperjs/core'

export type TriggerTypes = 'hover' | 'click'

export const tooltipProps = {
  content: {
    type: String
  },
  trigger: {
    type: String as PropType<TriggerTypes>,
    default: 'hover'
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'top'
  },
  popperOptions: {
    type: Object as PropType<Partial<Options>>
  }
}

export const tooltipEmits = {
  'visible-change': (visible: boolean) => typeof visible === 'boolean'
}

export type TooltipEmits = typeof tooltipEmits

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>
