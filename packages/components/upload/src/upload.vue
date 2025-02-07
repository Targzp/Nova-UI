<template>
  <UploadContent v-bind="uploadContentProps">
    <slot></slot>
  </UploadContent>
  {{ uploadFiles }}
  <!-- 列表 -->
  <!-- 预览 -->
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { UploadFile, UploadFiles, uploadProps, UploadRawFile } from './upload'
import UploadContent from './upload-content.vue'
import { UploadContentProps } from './upload-content'

defineOptions({
  name: 'nv-upload'
})

const emit = defineEmits(['update:file-list'])

const props = defineProps(uploadProps)

const uploadFiles = ref<UploadFiles>(props.fileList)

watch(uploadFiles, newVal => {
  emit('update:file-list', newVal)
})

const findFile = (rawFile: UploadRawFile) => {
  return uploadFiles.value.find(file => file.uid === rawFile.uid)
}

const uploadContentProps = computed<UploadContentProps>(() => {
  return {
    ...props,
    onStart: rawFile => {
      // 开始上传
      const uploadFile: UploadFile = {
        uid: rawFile.uid,
        name: rawFile.name,
        progress: 0,
        raw: rawFile,
        size: rawFile.size,
        status: 'start',
        url: URL.createObjectURL(rawFile)
      }
      uploadFiles.value = [...uploadFiles.value, uploadFile]
      props.onChange(uploadFile)
    },
    onProgress: (e, rawFile) => {
      // 上传中
      const uploadFile = findFile(rawFile)
      uploadFile!.status = 'uploading'
      uploadFile!.progress = e.percentage
      props.onProgress(e, uploadFile!, uploadFiles.value)
    },
    onRemove: async rawFile => {
      // 删除
      const uploadFile = findFile(rawFile)
      const r = await props.beforeRemove(uploadFile!, uploadFiles.value)
      if (r) {
        const fileList = uploadFiles.value
        uploadFiles.value.splice(fileList.indexOf(uploadFile!), 1)
        props.onRemove(uploadFile!, uploadFiles.value)
      }
    },
    onError: (err, rawFile) => {
      // 上传失败
      const uploadFile = findFile(rawFile)
      uploadFile!.status = 'error'
      const fileList = uploadFiles.value
      uploadFiles.value.splice(fileList.indexOf(uploadFile!), 1)
      props.onError(err, uploadFile!, uploadFiles.value)
    },
    onSuccess: (res, rawFile) => {
      // 上传成功
      const uploadFile = findFile(rawFile)
      uploadFile!.status = 'success'
      props.onSuccess(res, uploadFile!, uploadFiles.value)
    }
  }
})
</script>
