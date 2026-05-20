const { request } = require('./request');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 轮询异步识别任务，直到 completed / failed 或超时。
 * @param {string} taskId
 * @param {{ onProgress?: (elapsedMs: number) => void }} [options]
 */
async function pollRecognitionTask(taskId, options = {}) {
  const intervalMs = 2000;
  const maxWaitMs = 120000;
  const started = Date.now();

  while (Date.now() - started < maxWaitMs) {
    if (options.onProgress) options.onProgress(Date.now() - started);

    const res = await request({
      url: `/recognition/tasks/${taskId}`,
      method: 'GET',
      timeout: 15000,
    });

    if (res.status === 'processing') {
      await sleep(intervalMs);
      continue;
    }

    if (res.status === 'failed') {
      throw new Error(res.errorMessage || '识别失败');
    }

    if (res.status === 'completed') {
      return res;
    }

    await sleep(intervalMs);
  }

  throw new Error('识别超时，请换一张更清晰的照片或改用手动搜索');
}

module.exports = { pollRecognitionTask };
