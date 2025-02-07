<template>
  <div :class="[bem.b()]" @click="handleClick">
    <template v-if="drag">
      <UploadDragger @file="handleDragUpload">
        <slot></slot>
      </UploadDragger>
    </template>
    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { UploadRawFile } from './upload'
import { createNamespace } from '@nova-ui/utils/create'
import { uploadContentProps } from './upload-content'
import { httpRequest } from './ajax'
import UploadDragger from './upload-dragger.vue'

let id = 0
const getId = () => {
  return id++
}

defineOptions({
  name: 'nv-upload-content',
  inheritAttrs: false
})

const bem = createNamespace('upload')

const props = defineProps(uploadContentProps)

const handleDragUpload = (files: FileList) => {
  uploadFiles(files)
}

const upload = async (file: UploadRawFile) => {
  // 输入框清空
  inputRef.value!.value = ''
  const result = await props.beforeUpload(file)
  if (!result) {
    props.onRemove(file)
    return false // 停止上传
  }

  // 添加上传的过程，调用 ajax
  const { method, name, action, headers, data } = props
  httpRequest({
    method,
    file,
    name,
    action,
    headers,
    data,
    onError: e => {
      props.onError(e, file)
    },
    onProgress: e => {
      props.onProgress(e, file)
    },
    onSuccess: res => {
      props.onSuccess(res, file)
    }
  })
}

const uploadFiles = (files: FileList) => {
  if (files) {
    const fileList = Array.from(files)
    fileList.forEach(file => {
      const rawFile = file as UploadRawFile
      rawFile.uid = getId()
      props.onStart(rawFile)
      upload(rawFile)
    })
  }
}

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  uploadFiles(files!)
}

const inputRef = ref<HTMLInputElement>()
const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value!.click()
}
</script>
