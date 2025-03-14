<template>
  <div ref="popperContainNode" :class="bem.b()" v-on="outerEvents">
    <div ref="triggerNode" :class="bem.e('trigger')" v-on="events">
      <slot></slot>
    </div>
    <Transition :name="transition">
      <div
        v-if="isOpen"
        id="tooltip"
        ref="popperNode"
        :class="[bem.e('popper'), popperClass]"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div v-if="showArrow" id="arrow" data-popper-arrow></div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { createPopper } from '@popperjs/core'
import { useClickOutside } from '../../../hooks'

import type { Instance } from '@popperjs/core'
import { tooltipEmits, tooltipProps } from './tooltip'

defineOptions({
  name: 'nv-tooltip',
  inheritAttrs: false
})

const props = defineProps(tooltipProps)

const emit = defineEmits(tooltipEmits)

const bem = createNamespace('tooltip')

const popperContainNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()

let popperInstance: null | Instance = null

const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, props.offset]
        }
      }
    ],
    ...props.popperOptions
  }
})

const isOpen = ref(false)
const manualVisible = ref(false)
const selfVisible = ref(false)

const handleEmitVisible = (val: boolean) => {
  if (typeof props.visible === 'boolean') {
    emit('update:visible', val)
  }
}

const handleTooltipOpen = () => {
  isOpen.value = true
  selfVisible.value = true
  emit('visible-change', true)
  handleEmitVisible(true)
}

const handleTooltipClose = () => {
  isOpen.value = false
  selfVisible.value = false
  manualVisible.value = false
  emit('visible-change', false)
  handleEmitVisible(false)
}

const events = ref<Record<string, any>>({})
const outerEvents = ref<Record<string, any>>({})

const attachEvents = () => {
  if (props.disabled) return

  if (props.trigger === 'hover') {
    events.value['mouseenter'] = handleTooltipOpen
    outerEvents.value['mouseleave'] = handleTooltipClose
  } else if (props.trigger === 'click') {
    events.value['click'] = handleTooltipOpen
  }
}

useClickOutside(popperContainNode, () => {
  if (manualVisible.value && !selfVisible.value) {
    manualVisible.value = false
  } else {
    if (props.trigger && isOpen.value) {
      handleTooltipClose()
    }
  }
})

const getShadowCSSRule = (
  offset: number,
  placement: 'top' | 'left' | 'right' | 'bottom'
) => {
  const rule = `.nv-tooltip::after {
    position: absolute;
    content: '';
    opacity: 0;
    z-index: 10;
    width: ${['top', 'bottom'].includes(placement) ? '100%' : offset + 'px'};
    height: ${['left', 'right'].includes(placement) ? '100%' : offset + 'px'};
    ${placement === 'top' ? `top: -${offset}px;` : ''}
    ${placement === 'bottom' ? `bottom: -${offset}px;` : ''}
    ${placement === 'left' ? `left: -${offset}px;` : ''}
    ${placement === 'right' ? `right: -${offset}px;` : ''}
    
  }`
  return rule
}

/**
 * 设置popper与实体间隔阴影，防止移动到popper时，popper框消失
 */
const handleSetTooltipShadow = () => {
  if (!popperInstance) {
    return
  }
  const { placement } = popperInstance.state.options
  let _placement =
    placement.indexOf('-') > -1 ? placement.split('-')[0] : placement
  if (_placement === 'auto') {
    _placement = 'right'
  }
  const cssRule = getShadowCSSRule(
    props.offset,
    _placement as 'top' | 'left' | 'right' | 'bottom'
  )
  const styleSheets = document.styleSheets[0]
  styleSheets.insertRule(cssRule, styleSheets.cssRules.length)
}

watch(
  () => props.visible,
  async val => {
    manualVisible.value = val

    isOpen.value = val
  }
)

watch(
  isOpen,
  val => {
    if (val) {
      if (triggerNode.value && popperNode.value) {
        popperInstance = createPopper(
          triggerNode.value,
          popperNode.value,
          popperOptions.value
        )
        handleSetTooltipShadow()
      } else {
        popperInstance?.destroy()
      }
    }
  },
  {
    flush: 'post'
  }
)

watch(
  () => props.trigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      events.value = {}
      outerEvents.value = {}
      attachEvents()
    }
  }
)

attachEvents()

onMounted(() => {
  isOpen.value = !!props.visible
})

onUnmounted(() => {
  if (popperInstance) {
    popperInstance.destroy()
  }
})
</script>
