import { withInstall } from '@nova-ui/utils/with-install'
import _Upload from './src/upload.vue'

const Upload = withInstall(_Upload)

export { Upload }
export default Upload

export * from './src/upload'

declare module 'vue' {
  export interface GlobalComponents {
    NvUpload: typeof Upload
  }
}
