function getToken() {
  return wx.getStorageSync('access_token') || '';
}

function formatRequestError(err) {
  const msg = err && err.errMsg ? String(err.errMsg) : '';
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return '请求超时，请检查网络或稍后重试（拍照识别约需 10–30 秒）';
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
        const msg = res.data?.error?.message || '请求失败';
        reject(new Error(msg));
      },
      fail(err) {
        reject(new Error(formatRequestError(err)));
      },
    });
  });
}

/** 拍照识别等长耗时接口 */
function requestLong(options) {
  return request({ ...options, timeout: options.timeout ?? 60000 });
}

module.exports = { request, requestLong };
