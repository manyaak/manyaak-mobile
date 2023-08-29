const f = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

f(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    channel: '#dev_front-noti',
    text: `Planit 앱 빌드가 실패했어요.

Platform: ${process.env.EAS_BUILD_PLATFORM}
Profile: ${process.env.EAS_BUILD_PROFILE}
Link: https://expo.dev/accounts/planit-study/projects/planit/builds/${process.env.EAS_BUILD_ID}`,
  }),
});
