import { series, parallel, src, dest } from 'gulp'
import { buildConfig } from './utils/config'
import path from 'path'
import ts from 'gulp-typescript'
import { outDir, projectRoot } from './utils/paths'
import { withTaskName } from './utils'

// 专门打包 util，指令，hook等
export const buildPackages = (dirname: string, name: string) => {
  // 打包可以用 rollup，这个逻辑只是让 ts -> js 即可
  // rollup 可以将多个小模块打包成一个大模块
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    return series(
      withTaskName(`build:${dirname}`, () => {
        const tsConfig = path.resolve(projectRoot, 'tsconfig.json') // ts 配置文件的路径
        const inputs = ['**/*.ts', '!gulpfile.ts', '!node_modules']
        return src(inputs)
          .pipe(
            ts.createProject(tsConfig, {
              declaration: true, // 需要生成声明文件
              strict: false, // 关闭严格模式
              module: config.module
            })()
          )
          .pipe(dest(path.resolve(outDir, config.output.name, name)))
      })
    )
  })
  return parallel(...tasks)
}
