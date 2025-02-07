import { ExtractPropTypes, PropType } from 'vue'
import {
  baseProps,
  NOOP,
  UploadProgressEvent,
  uploadProps,
  UploadRawFile
} from './upload'

export const uploadContentProps = {
  ...baseProps,
  beforeUpload: uploadProps['beforeUpload'],
  onStart: {
    type: Function as PropType<(file: UploadRawFile) => void>,
    default: NOOP
  },
  onProgress: {
    type: Function as PropType<
      (e: UploadProgressEvent, rawFile: UploadRawFile) => void
    >,
    default: NOOP
  },
  onRemove: {
    type: Function as PropType<(rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onError: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Function as PropType<(err: any, rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onSuccess: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Function as PropType<(res: any, rawFile: UploadRawFile) => void>,
    default: NOOP
  }
} as const

export type UploadContentProps = ExtractPropTypes<typeof uploadContentProps>

export interface RequestOptions {
  method: string
  file: File
  name: string
  action: string
  headers: Headers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
  onError: (e: unknown) => void
  onSuccess: (response: unknown) => void
  onProgress: (e: UploadProgressEvent) => void
}
