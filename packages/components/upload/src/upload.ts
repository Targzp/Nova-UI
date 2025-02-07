import { ExtractPropTypes, PropType } from 'vue'

export interface UploadFile {
  uid?: number
  name: string
  url?: string
  progress?: number
  raw?: File
  size?: number
  status: string
}

export type UploadFiles = UploadFile[]

export type UploadRawFile = File & {
  uid: number
}

export type UploadProgressEvent = ProgressEvent & {
  percentage: number
}

export const NOOP = function () {
  // Eempty Function
}

export const baseProps = {
  fileList: {
    type: Array as PropType<UploadFiles>,
    default: () => []
  },
  action: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'file'
  },
  accept: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    default: 'post'
  },
  headers: {
    type: Headers,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  },
  drag: {
    type: Boolean,
    default: false
  }
} as const

export const uploadProps = {
  ...baseProps,
  // 预览回调
  onPreview: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  // 上传之前的回调
  beforeUpload: {
    type: Function as PropType<
      (file: UploadRawFile) => Promise<boolean> | boolean
    >,
    default: NOOP
  },
  // 上传文件变动的回调
  onChange: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  // 删除之前的回调
  beforeRemove: {
    type: Function as PropType<
      (file: UploadFile, uploadFiles: UploadFiles) => Promise<boolean> | boolean
    >,
    default: NOOP
  },
  // 删除回调
  onRemove: {
    type: Function as PropType<
      (file: UploadFile, uploadFiles?: UploadFiles) => void
    >,
    default: NOOP
  },
  // 文件上传进度回调
  onProgress: {
    type: Function as PropType<
      (
        evt: UploadProgressEvent,
        uploadFile: UploadFile,
        uploadFiles: UploadFiles
      ) => void
    >,
    default: NOOP
  },
  // 文件上传成功回调
  onSuccess: {
    type: Function as PropType<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  },
  // 上传失败回调
  onError: {
    type: Function as PropType<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  }
} as const

export type UploadProps = Partial<ExtractPropTypes<typeof uploadProps>>
