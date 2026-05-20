function getToken() {
  return wx.getStorageSync('access_token') || '';
}

function formatRequestError(err) {
  const msg = err && err.errMsg ? String(err.errMsg) : '';
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return '识别超时，请换光线更好的照片或改用手动搜索（约需 15–60 秒）';
  }
  if (msg.includes('fail')) {
    return '网络异常，请确认 API 已启动且开发者工具已关闭域名校验';
  }
  return err && err.message ? err.message : '请求失败';
}

function request(options) {
  const app = getApp();
  const base = app.globalData.apiBase;
  const timeout = options.timeout ?? 15000;

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      timeout,
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
        ...options.header,
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data?.data ?? res.data);
          return;
        }
        // Token from local dev or old JWT_SECRET is invalid on production API.
        if (res.statusCode === 401 && !options._retryAuth && !options.url?.includes('/auth/wechat')) {
          wx.removeStorageSync('access_token');
          const { ensureLogin } = require('./auth');
          ensureLogin()
            .then(() => request({ ...options, _retryAuth: true }).then(resolve).catch(reject))
            .catch(reject);
          return;
        }
        if (res.statusCode === 502 || res.statusCode === 503) {
          reject(
            new Error(
              res.data?.error?.message ||
                'API 网关异常(502)，请在 Zeabur 查看 calorie-analysis 运行日志与 PORT 配置',
            ),
          );
          return;
        }
        const msg = res.data?.error?.message || `请求失败 (${res.statusCode})`;
        reject(new Error(msg));
      },
      fail(err) {
        reject(new Error(formatRequestError(err)));
      },
    });
  });
}

/** 拍照识别等长耗时接口 */
/** 拍照识别：智谱视觉 + 上传大图，默认 120 秒 */
function requestLong(options) {
  return request({ ...options, timeout: options.timeout ?? 120000 });
}

module.exports = { request, requestLong };
