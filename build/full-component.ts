import esbuild from 'rollup-plugin-esbuild'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import scss from 'rollup-plugin-scss'
// import dartSass from 'sass'
import { terser } from 'rollup-plugin-terser'
import { parallel, series } from 'gulp'
import path from 'path'
import { nvRoot, outDir } from './utils/paths'
import { rollup, OutputOptions } from 'rollup'
import fs from 'fs/promises'
import { buildConfig } from './utils/config'
import { pathRewriter, runTask, withTaskName } from './utils'
import dts from 'vite-plugin-dts'

const buildFull = async () => {
  // rollup 打包的配置信息
  const config = {
    input: path.resolve(nvRoot, 'index.ts'), // 打包的入口
    external: id => /^vue/.test(id), // 表示打包的时候不打包 vue 代码(即Vue源码)
    plugins: [
      // scss({ include: /.scss$/, sass: dartSass }),
      nodeResolve(),
      commonjs(),
      vueJsx(),
      vue({
        include: /.vue$/
      }),
      esbuild({
        include: /.[jt]s$/,
        minify: process.env.NODE_ENV === 'production',
        target: 'es2015'
      })
    ]
  }

  // 整个组件库 两种使用方式，import 导入组件库，或者在浏览器中使用 script
  // esm 和 umd
  const buildConfig = [
    {
      format: 'umd',
      file: path.resolve(outDir, 'index.js'),
      name: 'NovaUI',
      exports: 'named', // 用命名的方式导出
      globals: {
        // 表示使用的 vue 是全局的，即该组件库需依赖全局下的 Vue 框架
        vue: 'Vue'
      },
      plugins: [terser()]
    },
    {
      format: 'esm',
      file: path.resolve(outDir, 'index.esm.js'),
      plugins: [terser()]
    }
  ]

  const bundle = await rollup(config)

  return Promise.all(
    buildConfig.map(config => bundle.write(config as OutputOptions))
  )
}

const buildEntry = async () => {
  const entryFiles = await fs.readdir(nvRoot, { withFileTypes: true }) // 需要携带文件类型(.ts)
  const entryPoints = entryFiles
    .filter(f => f.isFile())
    .filter(f => !['package.json'].includes(f.name))
    .map(f => path.resolve(nvRoot, f.name))

  const config = {
    input: entryPoints,
    plugins: [
      vueJsx(),
      vue({
        include: /.vue$/
      }),
      esbuild({
        include: /.[jt]s$/,
        minify: process.env.NODE_ENV === 'production',
        target: 'es2015'
      }),
      commonjs(),
      nodeResolve(),
      dts({
        root: `${nvRoot}/`, // 根目录
        outDir: path.resolve(outDir, 'entry/types'), // 生成目标文件
        include: ['*.ts'],
        beforeWriteFile: async (filePath, content) => {
          return {
            filePath,
            content: content.replaceAll('../components', `./components`)
          }
        }
      })
    ],
    external: (id: string) => /^vue/.test(id) || /^@nova-ui/.test(id)
  }

  const bundle = await rollup(config)
  return Promise.all(
    Object.values(buildConfig)
      .map(config => ({
        format: config.format,
        dir: config.output.path,
        paths: pathRewriter(config.output.name)
      }))
      .map(option => bundle.write(option as OutputOptions))
  )
}

export const copyEntryTypes = () => {
  const src = path.resolve(outDir, 'entry/types/nova-ui')
  const copy = (module: string) => {
    return withTaskName(`copyEntryTypes:${module}`, () =>
      runTask(
        `cp -r ${src}/* ${path.resolve(
          outDir,
          buildConfig[module].output.path
        )}`
      )
    )
  }
  return parallel(copy('esm'), copy('cjs'))
}

export const buildFullComponent = series(
  parallel(buildFull, buildEntry),
  copyEntryTypes()
)
