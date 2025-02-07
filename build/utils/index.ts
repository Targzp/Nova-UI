import { spawn } from 'child_process'
import { projectRoot } from './paths'

export const withTaskName = <T extends object>(taskName: string, fn: T) =>
  Object.assign(fn, { displayName: taskName })

// 在 node 中使用子进程来运行脚本
export const runTask = async (command: string) => {
  return new Promise(resolve => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: 'inherit', // 直接将这个子进程的输出共享给父进程
      shell: true // 默认情况下 linux 才支持 rm -rf
    })
    app.on('close', resolve)
  })
}

export const pathRewriter = (format: string) => {
  return (id: string) => {
    id = id.replaceAll('@nova-ui', `nova-ui/${format}`)
    return id
  }
}
