// 串行打包和并行打包
// gulp 不叫打包，做代码转化及任务流程控制
import { parallel, series } from 'gulp'
import { runTask, withTaskName } from './utils'
import { nvRoot, outDir } from './utils/paths'

const copySourceCode = async () => {
  await runTask(`cp ${nvRoot}/package.json ${outDir}/package.json`)
}

// 打包样式
// 打包工具方法
// 打包所有组件
// 打包每个组件
// 生成一个组件库
// 发布组件库
export default series(
  withTaskName('clean', () => runTask('rm -rf ./dist')),
  parallel(
    withTaskName('buildPackages', () =>
      runTask('pnpm run --filter "./packages/**" --parallel build')
    ),
    // 执行 build 命令时会调用 rollup，我们给 rollup 传递参数 buildFullComponent 那么就会执行导出任务叫 buildFullComponent
    withTaskName('buildFullComponent', () =>
      runTask('pnpm run build buildFullComponent')
    ),
    withTaskName('buildComponent', () => runTask('pnpm run build buildComponent')),
  ),
  copySourceCode
)

// 任务执行器 gulp 任务名 就会执行对应的任务
export * from './full-component'
export * from './component'
