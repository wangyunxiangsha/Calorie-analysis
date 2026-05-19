const { ensureLogin } = require('./utils/auth');

App({
  globalData: {
    apiBase: 'http://localhost:3000/api/v1',
  },
  onLaunch() {
    ensureLogin().catch(() => {
      console.warn('Dev login skipped — open in WeChat devtools');
    });
  },
});
