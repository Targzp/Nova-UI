<template>
  <div :class="[bem.b()]">
    <label
      :class="[bem.e('label'), bem.is('required', isRequiredAsterisk)]"
      :style="{
        width: labelWidth
      }"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div :class="bem.e('content')">
      <div :class="[bem.e('wrapper')]">
        <slot />
      </div>
      <Transition>
        <div v-if="showMessage && validateMessage" :class="bem.e('error')">
          <slot name="error">
            {{ validateMessage }}
          </slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace, getProp } from '@nova-ui/utils'
import { computed, inject, onMounted, provide, ref } from 'vue'
import {
  Arrayable,
  FormItemContextKey,
  FormItemContxt,
  formItemProps,
  FormItemRule,
  FormItemValidateState,
  ValidCallback
} from './form-item'
import { FormContextKey } from './form'
import AsyncValidator, { Values } from 'async-validator'
import { clone } from 'lodash-unified'

const bem = createNamespace('form-item')

defineOptions({
  name: 'nv-form-item'
})

let initialValue: any = undefined

const props = defineProps(formItemProps)

const formContent = inject(FormContextKey)

const fieldValue = computed(() => {
  const model = formContent?.model
  if (!model || !props.prop) {
    return
  }
  return getProp(model, props.prop).value
})

const labelWidth = computed(() => {
  const width =
    props.labelWidth !== 'auto' ? props.labelWidth : formContent!.labelWidth
  if (Number.isNaN(+width!)) {
    return width
  } else {
    return `${width}px`
  }
})

// 这里主要是校验逻辑
const validateState = ref<FormItemValidateState>('')

const validateMessage = ref('')

const convertArray = (rules?: Arrayable<FormItemRule>) => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

const _rules = computed(() => {
  const rules: FormItemRule[] = convertArray(props.rules) // 自身规则
  const formRules = formContent?.rules // form 容器总体规则
  if (formRules && props.prop) {
    const _temp = formRules[props.prop]
    if (_temp) {
      rules.push(...convertArray(_temp))
    }
  }
  return rules
})

const isRequiredAsterisk = computed(() => {
  return (
    !formContent?.hideRequiredAsterisk &&
    _rules.value.some(rule => {
      return rule.required
    })
  )
})

const getRuleFiltered = (trigger: string) => {
  const rules = _rules.value
  return rules.filter(rule => {
    if (!rule.trigger || !trigger) {
      // 这种情况意味着无论如何都需要校验
      return true
    }
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}

const onValidationSuccesseded = () => {
  validateState.value = 'success'
  validateMessage.value = ''
}
const onValidationFailed = (errorObj: Values) => {
  validateState.value = 'error'
  const { errors } = errorObj
  validateMessage.value = errors ? errors[0].message : ''
}

const validate: FormItemContxt['validate'] = async (
  trigger: string,
  callback?
) => {
  // 拿到触发的时机，校验是否通过可以调用 callback，或者调用 promise.then 方法
  const rules = getRuleFiltered(trigger)
  // rules 就是触发的规则，trigger 就是触发的方式
  // 需要找到对应的数据源 上面找到对应的 prop
  if (props.prop) {
    const modelName = props.prop
    // 拿到校验器
    const validator = new AsyncValidator({
      [modelName]: rules
    })
    return validator
      .validate({
        [modelName]: fieldValue.value || ''
      })
      .then(() => {
        onValidationSuccesseded()
        callback?.(true)
      })
      .catch((error: Values) => {
        onValidationFailed(error)
        callback?.(false, error.errors)
        return Promise.reject(error)
      })
  }
}

const validateFormItem = (callback: ValidCallback) => {
  validate('', callback)
}

const clearValidate = () => {
  validateState.value = ''
  validateMessage.value = ''
}

const resetField = async () => {
  const model = formContent?.model
  if (!model || !props.prop) {
    return
  }
  const computedValue = getProp(model, props.prop)

  computedValue.value = initialValue
  clearValidate()
}

const context: FormItemContxt = {
  ...props,
  validate,
  validateState,
  clearValidate,
  resetField
}
provide(FormItemContextKey, context)

onMounted(() => {
  if (props.prop) {
    formContent?.addField(context) // 将自身的上下文传递给了父亲
    initialValue = clone(fieldValue.value)
  }
})

defineExpose({
  validate: validateFormItem,
  clearValidate
})
</script>
