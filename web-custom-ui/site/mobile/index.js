const path = require('path');

const indexDemos = ['drawer', 'list-view']; // 这些组件每个 demo 都需要全屏展示，首页直接放其各个 demo 链接
const pluginAntdConfig = {
  babelConfig: {
    plugins: [
      [
        require.resolve('babel-plugin-import'),
        [{
          style: true,
          libraryName: 'antd_custom_ui',
          libraryDirectory: 'components',
        },
        {
          style: true,
          libraryName: 'antd-mobile',
          libraryDirectory: 'lib',
        }],
      ],
    ],
  },
};

module.exports = {
  lazyLoad(nodePath, nodeValue) {
    if (typeof nodeValue === 'string') {
      return true;
    }
    return nodePath.endsWith('/demo');
  },
  pick: {
    components(markdownData) {
      const filename = markdownData.meta.filename;
      if (!/^components/.test(filename) ||
          /\/demo$/.test(path.dirname(filename))) return;
      /* eslint-disable consistent-return */
      return {
        meta: markdownData.meta,
      };
      /* eslint-enable consistent-return */
    },
    /* eslint-disable consistent-return */
    indexDemos(markdownData) {
      const paths = markdownData.meta.filename.split('/');
      // add demos to index page, e.g. "components/drawer/demo/basic.md"
      if (paths[1] && indexDemos.indexOf(paths[1]) > -1 && paths[2] && paths[2] === 'demo') {
        return {
          component: paths[1],
          meta: markdownData.meta,
        };
      }
    },
  },
  plugins: [
    `bisheng-plugin-antd?${JSON.stringify(pluginAntdConfig)}`,
    'bisheng-plugin-react?lang=__react',
  ],

  hashSpliter: '-demo-', // URL 中记录到 hash 里的特殊标记
  cateChinese: {
    Navigation: '导航',
    'Basic Components': '基础组件',
    Form: '表单',
    'Operation Feedback': '操作反馈',
    Others: '其他',
  },
  routes: [{
    path: '/',
    component: './template/KitchenSink/index',
  }, {
    path: '/:component/',
    dataPath: '/components/:component',
    component: './template/KitchenSink/Demo',
  }],
};
