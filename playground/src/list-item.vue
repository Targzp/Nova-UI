<template>
  <div class="list-item" :data-index="source.index">
    <div class="list-item__head">
      <span>{{ source.index }}</span>
      <span>{{ source.name }}</span>
    </div>
    <div class="list-item__body">
      <span :style="{ fontSize: '18px' }">{{ source.desc }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  source: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped></style>
