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
    text: `Planit 앱이 새로 빌드되었어요.

Platform: ${process.env.EAS_BUILD_PLATFORM}
Profile: ${process.env.EAS_BUILD_PROFILE}
Link: https://expo.dev/accounts/planit-study/projects/planit/builds/${process.env.EAS_BUILD_ID}
Version: ${versionInfo.VERSION}
Runtime Version: ${versionInfo.RUNTIME_VERSION}
Build Number: ${versionInfo.BUILD_NUMBER}`,
  }),
});
