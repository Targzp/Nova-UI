import { UploadProgressEvent } from './upload'
import { RequestOptions } from './upload-content'

export function httpRequest(options: RequestOptions) {
  const xhr = new XMLHttpRequest()
  const action = options.action

  // 设置请求头
  const headers = options.headers
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value)
    }
  }

  // 设置请求体
  const formData = new FormData()
  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      formData.append(key, value)
    }
    formData.append(options.name, options.file)
  }

  xhr.upload.addEventListener('progress', e => {
    // 加载的总数和已经加载的百分比
    const progressEvents = e as UploadProgressEvent
    progressEvents.percentage = e.total > 0 ? (e.loaded / e.total) * 100 : 0
    options.onProgress(progressEvents) // 调用上传进度
  })

  xhr.onload = () => {
    if (xhr.status < 300 && xhr.status >= 200) {
      options.onSuccess(xhr.response)
    } else {
      options.onError({ status: xhr.status })
    }
  }

  xhr.addEventListener('error', () => {
    options.onError(xhr.response)
  })

  xhr.open(options.method, action, true)

  xhr.send(formData)

  return xhr
}
