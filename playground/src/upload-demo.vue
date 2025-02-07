<template>
  <div class="upload-demo">
    <nv-upload
      multiple
      action="http://localhost:4000/upload"
      :before-upload="handleBeforeUpload"
      drag
    >
      <nv-button>点我上传</nv-button>
    </nv-upload>
  </div>
</template>

<script lang="ts" setup>
import { UploadRawFile } from '@nova-ui/components/upload'

const handleBeforeUpload = (file: UploadRawFile) => {
  return true
}
</script>

<style lang="scss" scoped>
.upload-demo {
  margin-top: 12px;
}
</style>
