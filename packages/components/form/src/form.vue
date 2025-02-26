<template>
  <form :class="[bem.b(), inline ? bem.m('inline') : '']">
    <slot></slot>
  </form>
</template>

<script lang="ts" setup>
import { provide } from 'vue'
import { createNamespace } from '@nova-ui/utils/create'
import { FormContext, FormContextKey, formProps } from './form'
import { FormItemContxt, ValidCallback } from './form-item'
import { Values } from 'async-validator'
import { filterFields } from './utils'
import { Arrayable } from '@nova-ui/utils'

const bem = createNamespace('form')

defineOptions({
  name: 'nv-form'
})

const props = defineProps(formProps)

// form 的校验，在父级中调用所有儿子的校验方法
const validate = async (callback?: ValidCallback) => {
  let errors: Values = {}
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    return callback?.(true)
  } else {
    if (callback) {
      callback?.(false, errors)
    } else {
      return Promise.reject(errors)
    }
  }
}

const clearValidate = () => {
  for (const field of fields) {
    field.clearValidate()
  }
}

const fields: FormItemContxt[] = []
const addField: FormContext['addField'] = context => {
  fields.push(context)
}

const resetFields = (properties: Arrayable<string> = []) => {
  filterFields(fields, properties).forEach(field => {
    field.resetField()
  })
}

provide(FormContextKey, {
  ...props,
  addField,
  clearValidate,
  resetFields
})

defineExpose({
  validate,
  clearValidate,
  resetFields
})
</script>
