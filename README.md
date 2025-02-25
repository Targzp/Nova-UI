# Nova-UI 前端组件库

## 介绍

Nova-UI 是一个基于 Vue 3 和 TypeScript 的前端 UI 组件库。

## 安装

建议使用包管理器（如 NPM、Yarn、PNPM）安装 Nova-UI。

```bash
npm install nova-ui
or
yarn add nova-ui
or
pnpm install nova-ui
```

## 快速开始

### 完整引入

完整引入会将所有组件全量引入到项目中，对项目打包后文件大小不介意者可使用此方式。

```js
import { createApp } from 'vue';
import NovaUI from 'nova-ui';
import 'nova-ui/theme-chalk/css/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.mount('#app');
```

### 手动导入

手动导入会将需要的组件按需导入到项目中。

```js
<template>
  <nv-button>NvButton</nv-button>
</template>
<script>
import { NvButton } from 'nova-ui'
export default {
  components: { NvButton },
}
</script>
```

> 注意：组件样式需要在入口文件中全量引入，否则样式可能会出现问题。

## 贡献

欢迎提交问题报告和拉取请求！如有任何问题，欢迎通过 [GitHub Issues](https://github.com/Targzp/Nova-UI/issues) 进行反馈。

## 许可证

该项目采用 MIT 许可证，详细信息请查看 [LICENSE](https://github.com/Targzp/Nova-UI/blob/master/LICENSE) 文件。
