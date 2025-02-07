<script setup lang="ts">
import { Key, TreeOption } from '@nova-ui/components/tree'
import { reactive, ref } from 'vue'
import { Random } from 'mockjs'

import { AddCircle } from '@vicons/ionicons5'
import {
  FormInstanceType,
  FormItemInstanceType
} from '@nova-ui/components/form'

import UploadDemo from './upload-demo.vue'
import ListItem from './list-item.vue'

function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level) return []
  const arr = new Array(20 - level).fill(0)
  return arr.map((_, index) => {
    const key = `${baseKey}${level}${index}`
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    }
  })
}

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       key: 1,
//       isLeaf: false // 这里 isLeaf 为 false 表示点击的时候动态的加载子节点
//     },
//     {
//       label: nextLabel(),
//       key: 2,
//       isLeaf: false
//     }
//   ]
// }

function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three')
    return 'Out of Three, the created universe'
  if (currentLabel === 'Out of Three, the created universe')
    return 'Out of Tao, One is born'
  return ''
}

const data = ref(createData())

const value = ref<Key[]>([])

const handleLoad = (node: TreeOption) => {
  // 内部肯定需要将展开的节点传递给我
  return new Promise<TreeOption[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        // 这个数据会作为当前展开的 node 的 children 属性
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 1000)
  })
}

const check = ref(true)

const handleChange = (val: boolean) => {
  console.log('val: ', val)
}

const handleClick = () => {
  console.log('点击')
}

const user = ref({
  name: '',
  age: ''
})

const rules = [
  {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }
  // {
  //   min: 6,
  //   max: 10,
  //   message: '用户名至少6-10位',
  //   trigger: ['blur', 'change']
  // }
]

const formRef = ref<FormInstanceType>()
const ageFormItemRef = ref<FormItemInstanceType>()

const handleValidate = () => {
  formRef.value?.validate((valid: boolean, errors) => {
    console.log('valid: ', valid)
    console.log('errors: ', errors)
  })
}

const handleItemValidate = () => {
  ageFormItemRef.value?.validate((valid: boolean, errors) => {
    console.log('valid: ', valid)
    console.log('errors: ', errors)
  })
}

const handleClearValidate = () => {
  formRef.value?.clearValidate()
}

const curDate = ref(new Date())

interface DataType {
  id: number
  name: string
  desc: string
  index: number
}

const totalCount = 101

const totalData: DataType[] = []

let index = 0

while (index++ !== totalCount) {
  totalData.push({
    id: index,
    name: Random.name(),
    desc: Random.csentence(20, 120),
    index
  })
}

const items = ref(totalData)
console.log('items: ', items.value)
</script>

<template>
  <!-- <nv-icon :color="'red'" :size="50">
    <AddCircle />
  </nv-icon>
  <nv-icon :color="'yellow'" :size="50">
    <AddCircle />
  </nv-icon> -->

  <!-- 在使用树组件的时候，会传递一个树型的结构 -->
  <nv-tree
    v-model:selected-keys="value"
    :data="data"
    label-field="label"
    key-field="key"
    children-field="children"
    :selectable="true"
    :on-load="handleLoad"
    :show-checkbox="true"
    :default-checked-keys="['4030', '4230', '41']"
  >
    <template #default="{ node }"> {{ node.key }}-{{ node.label }} </template>
  </nv-tree>
  <nv-button
    size="tiny"
    type="primary"
    :loading="false"
    icon-placement="left"
    @click="handleClick"
  >
    <template #icon>
      <nv-icon>
        <AddCircle />
      </nv-icon>
    </template>
    点击
  </nv-button>

  <!-- <nv-input
    v-model="userName"
    :show-password="true"
    placeholder="请输入内容"
    @blur="handleBlur"
  > -->
  <!-- <template #prepend> 测试内容 </template> -->
  <!-- <template #prefixIcon>
      <nv-icon>
        <AddCircle />
      </nv-icon>
    </template> -->
  <!-- <template #suffixIcon>
      <nv-icon>
        <AddCircle />
      </nv-icon>
    </template> -->
  <!-- <template #append> 测试内容 </template> -->
  <!-- </nv-input> -->
  <!-- <nv-checkbox v-model="check" @change="handleChange">节点</nv-checkbox> -->
  <p></p>
  <nv-form
    ref="formRef"
    :label-width="80"
    :model="user"
    :rules="{
      name: {
        min: 6,
        max: 10,
        message: '用户名至少6-10位',
        trigger: ['blur', 'change']
      },
      age: {
        required: true,
        message: '请输入年龄',
        trigger: 'blur'
      }
    }"
  >
    <nv-form-item :rules="rules" prop="name">
      <template #label>用户名</template>
      <nv-input v-model="user.name" placeholder="请输入用户名"></nv-input>
    </nv-form-item>
    <nv-form-item ref="ageFormItemRef" prop="age">
      <template #label>年龄</template>
      <nv-input v-model="user.age" placeholder="请输入年龄"></nv-input>
    </nv-form-item>
  </nv-form>
  <nv-button size="tiny" type="primary" @click="handleItemValidate">
    验证年龄
  </nv-button>
  <nv-button size="tiny" type="primary" @click="handleClearValidate">
    清除验证结果
  </nv-button>
  <nv-button size="tiny" type="primary" @click="handleValidate">
    提交
  </nv-button>

  <UploadDemo />
  <nv-calendar v-model="curDate">
    <template #date-cell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>
    </template>
  </nv-calendar>

  <nv-virtual-scroll-list
    class="virtual-list"
    :data-sources="items"
    data-key="id"
    :keeps="30"
    :estimate-size="80"
    :data-component="ListItem"
  ></nv-virtual-scroll-list>
</template>

<style scoped lang="scss">
.virtual-list {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  border: 3px solid #ccc;
}
</style>
