module.exports = {
  title: 'nova-ui',
  description: 'nova-ui',
  themeConfig: {
    lastUpdated: '最后更新时间',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '编辑此网站',
    repo: 'https://gitee.com/login',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present nova-ui'
    },
    nav: [
      {text: '指南', link: '/guide/installation', activeMatch: '/guide/'},
      {text: '组件', link: '/components/icon', activeMatch: '/components/'}
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            {text: '安装', link: '/guide/installation'},
            {text: '快速上手', link: '/guide/quickStart'}
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            {text: 'Icon', link: '/components/icon'},
          ]
        }
      ]
    }
  }
}