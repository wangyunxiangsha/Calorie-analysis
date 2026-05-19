const { request } = require('./request');

function ensureLogin() {
  const token = wx.getStorageSync('access_token');
  if (token) return Promise.resolve(token);

  return new Promise((resolve, reject) => {
    wx.login({
      success: async (res) => {
        try {
          const data = await request({
            url: '/auth/wechat',
            method: 'POST',
            data: { code: res.code || 'dev_code' },
          });
          wx.setStorageSync('access_token', data.accessToken);
          resolve(data.accessToken);
        } catch (e) {
          reject(e);
        }
      },
      fail: reject,
    });
  });
}

module.exports = { ensureLogin };
