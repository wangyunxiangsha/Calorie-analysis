const { ensureLogin } = require('./utils/auth');

App({
  globalData: {
    apiBase: 'https://calorie-analysis.preview.aliyun-zeabur.cn/api/v1',
  },
  onLaunch() {
    ensureLogin().catch(() => {
      console.warn('Dev login skipped — open in WeChat devtools');
    });
  },
});
