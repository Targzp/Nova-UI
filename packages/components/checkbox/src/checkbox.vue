<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input
        ref="inputRef"
        v-model="model"
        type="checkbox"
        :disabled="disabled"
        :value="label"
        @change="handleChange"
      />
    </span>
    <span v-if="$slots.default || label" :class="bem.e('label')">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils/create'
import { checkboxEmits, checkboxProps } from './checkbox'
import { computed, onMounted, ref, watch } from 'vue'

const bem = createNamespace('checkbox')

defineOptions({
  name: 'nv-checkbox'
})

const props = defineProps(checkboxProps)
const emit = defineEmits(checkboxEmits)

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value!)
  }
})

const inputRef = ref<HTMLInputElement>()

const handleIndeterminate = (val: boolean) => {
  if (inputRef.value) {
    inputRef.value.indeterminate = val
  }
}

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('change', target.checked ? true : false)
}

watch(() => props.indeterminate, handleIndeterminate)

onMounted(() => {
  handleIndeterminate(props.indeterminate)
})
</script>
