// 打包样式
import { series, src, dest } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import path from 'path'

const compile = () => {
  const sass = gulpSass(dartSass)
  return src(path.resolve(__dirname, './src/*.scss'))
    .pipe(sass.sync()) // 编译 scss 到 css
    .pipe(autoprefixer()) // 增加浏览器兼容性前缀
    .pipe(cleanCss()) // 压缩 css
    .pipe(dest('./dist/css'))
}

// 暂时没有字体文件，无需配置
// const copyfont = () => {
//   return src(path.resolve(__dirname, './src/fonts/**'))
//     .pipe(cleanCss())
//     .pipe(dest('./dist/fonts'))
// }

const copyFullStyle = () => {
  return src(path.resolve(__dirname, './dist/**')).pipe(
    dest(path.resolve(__dirname, '../../dist/theme-chalk'))
  )
}

export default series(compile, copyFullStyle)
