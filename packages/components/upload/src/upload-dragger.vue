<template>
  <div
    @dragover.prevent="onDragover"
    @dragleave="isOver = false"
    @drop.prevent="onDrop"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['file'])

const isOver = ref(false)

const onDragover = () => {
  isOver.value = true
}

const onDrop = (e: DragEvent) => {
  e.stopPropagation()
  emit('file', e.dataTransfer!.files)
}
</script>
