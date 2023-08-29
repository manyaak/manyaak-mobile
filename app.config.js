require('dotenv').config();
const Joi = require('joi');
const versionInfo = require('./versionInfo');

// 환경변수 목록
const envSchema = Joi.object({
  /**
   * 'development' : 개발 환경
   * 'storybook' : 개발 환경 & storybook 활성화
   * 'preview' : 배포 환경, 테스트 서버
   * 'production' : 배포 환경, 운영 서버
   */
  APP_MODE: Joi.string()
    .valid('development', 'storybook', 'preview', 'production')
    .required(),
  // KAKAO_APP_KEY: Joi.string().required(),
});

// 환경변수 검증
const validationResult = envSchema.validate({
  APP_MODE: process.env.APP_MODE,
  // KAKAO_APP_KEY: process.env.KAKAO_APP_KEY,
});
if (validationResult.error) {
  throw validationResult.error;
}

// 실제 앱에서 활용할 값들 정제
const config = {
  APP_MODE: process.env.APP_MODE,
  KAKAO_APP_KEY: process.env.KAKAO_APP_KEY,
};

/** @type { { expo: import("expo/config").ExpoConfig } } */
module.exports = {
  expo: {
    name: '만약',
    slug: 'manyaak',
    owner: 'aube',
    version: versionInfo.VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    runtimeVersion: versionInfo.RUNTIME_VERSION,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#050626',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      checkAutomatically: 'ON_ERROR_RECOVERY',
      url: 'https://u.expo.dev/740edecc-0939-4014-9607-28e99b73bf79',
    },
    assetBundlePatterns: ['**/*'],
    plugins: [
      [
        '@react-native-seoul/kakao-login',
        {
          kakaoAppKey: process.env.KAKAO_APP_KEY,
          kotlinVersion: '1.6.10',
        },
      ],
      'expo-apple-authentication',
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.manyaak.manyaak',
      buildNumber: `${versionInfo.BUILD_NUMBER}`,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      versionCode: versionInfo.BUILD_NUMBER,
      package: 'com.manyaak.manyaak',
      // https://stackoverflow.com/questions/55665337/keystoreexception-signature-mac-verification-failed-when-trying-to-decrypt
      allowBackup: false,
      softwareKeyboardLayoutMode: 'pan',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      ...config,
      eas: {
        projectId: '740edecc-0939-4014-9607-28e99b73bf79',
      },
    },
  },
};
