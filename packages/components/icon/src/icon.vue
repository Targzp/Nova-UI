<template>
  <i :class="bem.b()" :style="style">
    <slot></slot>
  </i>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils/create'
import { iconProps } from './icon'
import { computed } from 'vue'

const bem = createNamespace('icon')

defineOptions({
  name: 'nv-icon'
})

const props = defineProps(iconProps)

// 计算属性来计算一个样式来处理
const style = computed(() => {
  if (!props.size && !props.color) {
    return {}
  }
  return {
    ...(props.size ? { 'font-size': props.size + 'px' } : {}),
    ...(props.color ? { color: props.color, fill: props.color } : {})
  }
})
</script>

<style lang="scss" scoped></style>
