<template>
  <button
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('loading', loading),
      bem.is('disabled', disabled)
    ]"
    v-bind="$attrs"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
    @mousedown="emit('mousedown', $event)"
  >
    <template v-if="iconPlacement === 'left'">
      <NvIcon :class="bem.e('left-icon')" size="25" color="#fff">
        <Loading v-if="loading" />
        <template v-else-if="slots.icon">
          <component :is="slots.icon" />
        </template>
      </NvIcon>
    </template>
    <slot />
    <template v-if="iconPlacement === 'right'">
      <NvIcon :class="bem.e('right-icon')" size="25" color="#fff">
        <Loading v-if="loading" />
        <template v-else-if="slots.icon">
          <component :is="slots.icon" />
        </template>
      </NvIcon>
    </template>
  </button>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils/create'
import { buttonEmits, buttonProps } from './button'
import NvIcon from '@nova-ui/components/icon'
import {Loading} from '@nova-ui/components/internal-icon'
import { useSlots } from 'vue'

const bem = createNamespace('button')

defineProps(buttonProps)

const emit = defineEmits(buttonEmits)

const slots = useSlots()

defineOptions({
  name: 'nv-button',
  inheritAttrs: false
})
</script>

<style lang="scss" scoped></style>
