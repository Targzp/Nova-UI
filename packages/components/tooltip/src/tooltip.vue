<template>
  <div ref="popperContainNode" :class="bem.b()" v-on="outerEvents">
    <div ref="triggerNode" :class="bem.e('trigger')" v-on="events">
      <slot></slot>
    </div>
    <div v-if="isOpen" ref="popperNode" :class="bem.e('popper')">
      <span :class="bem.e('arrow')" :style="popperArrowStyle[placement]"></span>
      <slot name="content">
        {{ content }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils'
import { computed, CSSProperties, onUnmounted, ref, watch } from 'vue'
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
          offset: [0, 9]
        }
      }
    ],
    ...props.popperOptions
  }
})

const popperArrowStyle: Record<string, CSSProperties> = {
  top: {
    bottom: '-5px',
    left: '50%',
    transform: 'translate(-50%, 0px)'
  },
  bottom: {
    top: '-5px',
    left: '50%',
    transform: 'translate(-50%, 0px)'
  },
  left: {
    right: '-5px',
    transform: 'translate(0px, 50%)'
  },
  right: {
    left: '-5px',
    transform: 'translate(0px, 50%)'
  }
}

const isOpen = ref(false)

const handleTooltipOpen = () => {
  isOpen.value = true
  emit('visible-change', true)
}

const handleTooltipClose = () => {
  isOpen.value = false
  emit('visible-change', false)
}

const events = ref<Record<string, any>>({})
const outerEvents = ref<Record<string, any>>({})

const attachEvents = () => {
  if (props.trigger === 'hover') {
    events.value['mouseenter'] = handleTooltipOpen
    outerEvents.value['mouseleave'] = handleTooltipClose
  } else if (props.trigger === 'click') {
    events.value['click'] = handleTooltipOpen
  }
}

useClickOutside(popperContainNode, () => {
  if (props.trigger && isOpen.value) {
    handleTooltipClose()
  }
})

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

onUnmounted(() => {
  if (popperInstance) {
    popperInstance.destroy()
  }
})
</script>
