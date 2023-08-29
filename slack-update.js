const f = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const versionInfo = require('./versionInfo');

f(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    channel: '#dev_front-noti',
    text: `Planit 앱이 업데이트되었어요.

Profile: ${process.env.APP_MODE}
Version: ${versionInfo.VERSION}
Runtime Version: ${versionInfo.RUNTIME_VERSION}`,
  }),
});
