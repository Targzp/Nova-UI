import esbuild from 'rollup-plugin-esbuild'
import vue from '@vitejs/plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { terser } from 'rollup-plugin-terser'
import { parallel, series } from 'gulp'
import { sync, glob } from 'fast-glob'
import { compRoot, outDir, projectRoot } from './utils/paths'
import { rollup, OutputOptions, RollupOptions } from 'rollup'
import path from 'path'
import { buildConfig } from './utils/config'
import { pathRewriter, runTask } from './utils'
import dts from 'vite-plugin-dts'
// import { Project, SourceFile, OutputFile } from 'ts-morph'
import fs from 'fs/promises'
// import * as VueCompiler from '@vue/compiler-sfc'

// 打包每个组件
const buildEachComponent = async () => {
  const files = sync('*', {
    cwd: compRoot, // 文件夹路径
    onlyDirectories: true // 只获取文件夹
  })
  // 分别把 components 文件夹下的组件放到 dist/es/components 文件夹下和 dist/lib/components 文件夹下
  const builds = files.map(async file => {
    const input = path.resolve(compRoot, file, 'index.ts') // 每个组件的入口
    const config = {
      input, // 打包的入口
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
        nodeResolve(),
        commonjs(),
        dts({
          root: compRoot, // 根目录
          outDir: path.resolve(outDir, 'types', 'components'), // 生成目标文件
          include: ['**/*.ts', '**/*.tsx', '**/*.vue'],
          beforeWriteFile: async (filePath, content) => {
            return {
              filePath,
              content: content.replaceAll('@nova-ui', `nova-ui/es`)
            }
          }
        })
      ],
      external: id => /^vue/.test(id) || /^@nova-ui/.test(id)
    }
    const bundle = await rollup(config as RollupOptions)
    const optinons = Object.values(buildConfig).map(config => ({
      format: config.format,
      file: path.resolve(config.output.path, `components/${file}/index.js`),
      paths: pathRewriter(config.output.name),
      plugins: [terser()]
    }))

    await Promise.all(
      optinons.map(option => bundle.write(option as OutputOptions))
    )
  })

  return Promise.all(builds)
}

const copyTypes = () => {
  const src = path.resolve(outDir, 'types/components/')

  const copy = (module: string) => {
    const output = path.resolve(outDir, module, 'components')
    return async () => {
      runTask(`cp -r ${src}/* ${output}`)
    }
  }

  return parallel(copy('es'), copy('lib'))
}

const buildComponentEntry = async () => {
  const config = {
    input: path.resolve(compRoot, 'index.ts'),
    plugins: [
      esbuild({
        include: /.[jt]s$/,
        minify: process.env.NODE_ENV === 'production',
        target: 'es2015'
      })
    ],
    external: () => true
  }

  const bundle = await rollup(config)
  return Promise.all(
    Object.values(buildConfig)
      .map(config => ({
        format: config.format,
        file: path.resolve(config.output.path, 'components/index.js')
      }))
      .map(config => bundle.write(config as OutputOptions))
  )
}

export const buildComponent = series(buildEachComponent, copyTypes(), buildComponentEntry)

// const genTypes = async () => {
//   const project = new Project({
//     // 生成 .d.ts 我们需要有一个 tsconfig
//     compilerOptions: {
//       allowJs: true,
//       declatration: true,
//       emitDeclarationOnly: true, // 是否仅抛出声明
//       noEmitOnError: true,
//       outDir: path.resolve(outDir, 'types'), // 生成目标文件
//       baseUrl: projectRoot,
//       paths: {
//         '@nova-ui/*': ['packages/*'] // 把 @nova-ui/* 路径映射到 packages/*
//       },
//       skipLibCheck: true, // 跳过类库检测
//       strict: false,
//     },
//     tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'),
//     skipAddingFilesFromTsConfig: true // 跳过添加 tsconfig 文件
//   })

//   // ** 代表任意目录
//   // * 代表任意文件
//   const filePaths = await glob('**/*', {
//     cwd: compRoot,
//     onlyFiles: true,
//     absolute: true
//   })

//   const sourceFiles: SourceFile[] = []
//   await Promise.all(
//     filePaths.map(async file => {
//       if (file.endsWith('.vue')) {
//         const content = await fs.readFile(file, 'utf-8')
//         const sfc = VueCompiler.parse(content) // 解析 Vue 单文件组件
//         if (sfc.descriptor.scriptSetup) {
//           const content = sfc.descriptor.scriptSetup.content // 拿到脚本
//           const sourceFile = project.createSourceFile(file + '.ts', content) // icon.vue.ts -> icon.vue.d.ts
//           sourceFiles.push(sourceFile)
//         }
//       } else if (file.endsWith('.ts')) {
//         const sourceFile = project.addSourceFileAtPath(file) // 把所有的 ts 文件都放在一起发射成 .d.ts 文件
//         sourceFiles.push(sourceFile)
//       }
//     })
//   )
//   await project.emit({
//     // 默认是放到内存中的
//     emitOnlyDtsFiles: true // 只生成 d.ts 文件
//   })
//   const tasks = sourceFiles.map(async (sourceFile: SourceFile) => {
//     const emitOutput = sourceFile.getEmitOutput()
//     console.log('emitOutput: ', emitOutput.getOutputFiles())
//     const tasks = emitOutput
//       .getOutputFiles()
//       .map(async (outputFile: OutputFile) => {
//         const filepath = outputFile.getFilePath()
//         await fs.mkdir(path.dirname(filepath), {
//           recursive: true
//         })
//         // @nova-ui -> nova-ui/es -> .d.ts 肯定不用去 lib 下查找
//         await fs.writeFile(filepath, pathRewriter('es')(outputFile.getText()))
//       })
//     await Promise.all(tasks)
//   })

//   await Promise.all(tasks)
// }
