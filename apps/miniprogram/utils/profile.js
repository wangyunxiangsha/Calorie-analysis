const { request } = require('./request');

function needsOnboarding(profile) {
  return !profile || profile.weightKg == null || profile.heightCm == null;
}

async function ensureProfileReady() {
  const profile = await request({ url: '/users/me' });
  if (needsOnboarding(profile)) {
    wx.redirectTo({ url: '/pages/onboarding/onboarding' });
    return null;
  }
  return profile;
}

module.exports = { needsOnboarding, ensureProfileReady };
