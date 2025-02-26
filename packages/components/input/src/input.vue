<template>
  <div v-if="type !== 'textarea'" :class="[bem.b()]">
    <div :class="[bem.e('group')]">
      <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
        <slot name="prepend"></slot>
      </div>
      <div
        :class="[bem.e('wrapper'), bem.is('error', isError)]"
        @mouseenter="handleHover(true)"
        @mouseleave="handleHover(false)"
      >
        <span v-if="slots.prefixIcon" :class="[bem.e('prefix')]">
          <slot name="prefixIcon"></slot>
        </span>
        <!-- 如果需要显示密码，在看当前是普通文本还是密码 -->
        <input
          ref="inputRef"
          :type="showPassword ? (passwordVisisble ? 'text' : 'password') : type"
          v-bind="$attrs"
          :class="[bem.e('inner')]"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />
        <div :class="bem.e('suffix-wrapper')">
          <span v-if="showPwdVisible" :class="[bem.e('suffix')]">
            <NvIcon size="20" color="#ccc" @click="handlePasswordVisisble">
              <ShowPassword v-if="passwordVisisble" />
              <HidePassword v-else />
            </NvIcon>
          </span>
          <span v-if="showClearable" :class="[bem.e('suffix')]">
            <NvIcon size="15" color="#ccc" @click="handleClear">
              <Clearable />
            </NvIcon>
          </span>
          <span v-if="slots.suffixIcon" :class="[bem.e('suffix')]">
            <slot name="suffixIcon"></slot>
          </span>
          <span
            v-if="
              showWordLimit && !showPwdVisible && Number.isFinite(maxLength)
            "
            :class="[bem.e('suffix'), bem.e('word-limit')]"
          >
            <span>{{ curInputLength }} / {{ maxLength }}</span>
          </span>
        </div>
      </div>
      <div v-if="slots.append" :class="bem.be('group', 'append')">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
  <div v-else-if="type === 'textarea'" :class="[textareaBem.b()]">
    <textarea
      ref="textareaRef"
      v-bind="$attrs"
      :class="[textareaBem.e('inner'), textareaBem.is('error', isError)]"
      :style="{ resize: resize }"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>
    <div
      :class="textareaBem.e('suffix-wrapper')"
      :style="{ right: `calc(100% - ${curTextareaWidth - 11}px)` }"
    >
      <span
        v-if="showWordLimit && Number.isFinite(maxLength)"
        :class="[bem.e('suffix'), bem.e('word-limit')]"
      >
        <span>{{ curInputLength }} / {{ maxLength }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@nova-ui/utils/create'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useSlots,
  watch,
  inject,
  useAttrs
} from 'vue'
import { inputEmits, inputProps } from './input'
import {
  ShowPassword,
  HidePassword,
  Clearable
} from '@nova-ui/components/internal-icon'
import NvIcon from '@nova-ui/components/icon'
import { FormItemContextKey } from '@nova-ui/components/form'

const bem = createNamespace('input')
const textareaBem = createNamespace('textarea')

const formItemContext = inject(FormItemContextKey)

defineOptions({
  name: 'nv-input',
  inheritAttrs: false
})

const props = defineProps(inputProps)

const emit = defineEmits(inputEmits)

const attrs = useAttrs()

const slots = useSlots()

const isError = computed(() => {
  return formItemContext?.validateState.value === 'error'
})

const inputRef = ref<HTMLInputElement>()
const setNativeInputValue = () => {
  const inputEle = props.type !== 'textarea' ? inputRef.value : textareaRef.value
  if (inputEle) {
    inputEle.value = String(props.modelValue)
    curInputLength.value = inputEle.value.length
  }
}

const maxLength = computed(() => {
  if (typeof attrs.maxlength === 'string') {
    if (!Number.isNaN(parseInt(attrs.maxlength))) {
      return +attrs.maxlength
    }
  } else if (typeof attrs.maxlength === 'number') {
    return attrs.maxlength
  }
  return Infinity
})
const curInputLength = ref(0)

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  curInputLength.value = value.length
  emit('input', value)
  emit('update:modelValue', value) // 触发事件可以实现双向绑定
}

const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('change', value)
}

const handleBlur = (e: FocusEvent) => {
  formItemContext?.validate('blur').catch(err => {
    return err
  })
  emit('blur', e)
}

const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}

// 监控 value 的值的变化 重新赋值
watch(
  () => props.modelValue,
  () => {
    formItemContext?.validate('change').catch(err => {
      return err
    })
    setNativeInputValue()
  }
)

const focus = () => {
  // 重新获取焦点
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const passwordVisisble = ref(false)

const showPwdVisible = computed(() => {
  return (
    props.modelValue && props.showPassword && !props.disabled && !props.readonly
  )
})

const handlePasswordVisisble = () => {
  passwordVisisble.value = !passwordVisisble.value
  focus()
}

const showClearable = computed(() => {
  return (
    props.modelValue &&
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    isHover.value
  )
})

const handleClear = () => {
  emit('input', '')
  emit('clear')
  emit('update:modelValue', '')
}

const isHover = ref(false)
const handleHover = (hoverStatus: boolean) => {
  isHover.value = hoverStatus
}

const textareaRef = ref<HTMLInputElement>()
const curTextareaWidth = ref(0) // 当前文本域框宽度

const textareaObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    const borderBoxSize = Array.isArray(entry.borderBoxSize)
      ? entry.borderBoxSize[0]
      : entry.borderBoxSize
    curTextareaWidth.value = borderBoxSize.inlineSize
  }
})

onMounted(() => {
  // 组件加载完毕后 设置一次输入框的值
  setNativeInputValue()

  if (props.type === 'textarea' && textareaRef.value) {
    textareaObserver.observe(textareaRef.value)
    curTextareaWidth.value = textareaRef.value.offsetWidth
  }
})
</script>
