import { Screen } from '@/constants/screens';
import {
  RootNavigatorScreenNP,
  RootNavigatorScreenRP,
} from '@/routes/RootNavigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { styles } from './WebViewScreen.style';
import { useRef } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import * as AppleLogin from 'expo-apple-authentication';

export type WebViewScreenParams = {
  url: string;
};

type WebViewScreenRP = RootNavigatorScreenRP<Screen.WebViewScreen>;
type WebViewScreenNP = RootNavigatorScreenNP<Screen.WebViewScreen>;

const loginWithKakao = async () => {
  try {
    const token = (await KakaoLogin.login()) as KakaoLogin.KakaoOAuthToken;
    return token.idToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const loginWithApple = async () => {
  try {
    const credential = await AppleLogin.signInAsync({
      requestedScopes: [AppleLogin.AppleAuthenticationScope.EMAIL],
    });
    return credential.identityToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const WebViewScreen = () => {
  const { params } = useRoute<WebViewScreenRP>();
  const navigation = useNavigation<WebViewScreenNP>();
  const ref = useRef<WebView>(null);
  const { top, bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.webView}>
      <WebView
        ref={ref}
        source={{ uri: params.url }}
        style={[styles.webView]}
        injectedJavaScriptBeforeContentLoaded={`
          window.isReactNativeApp = true;
          window.safeAreaInsets = {
            top: ${top},
            bottom: ${bottom},
          };
        `}
        injectedJavaScript={`
          window.ReactNativeWebView.postMessage('apple-login');
          window.addEventListener('message', (e) => {
            alert(e.data);
          })
        `}
        domStorageEnabled
        textInteractionEnabled={false}
        showsVerticalScrollIndicator={false}
        onMessage={(e) => {
          const message = e.nativeEvent.data;

          if (message === 'kakao-login') {
            loginWithKakao().then((idToken) => {
              if (idToken !== null) {
                ref.current?.postMessage(idToken);
              } else {
                ref.current?.postMessage('error');
              }
            });
          } else if (message === 'apple-login') {
            loginWithApple().then((idToken) => {
              if (idToken !== null) {
                ref.current?.postMessage(idToken);
              } else {
                ref.current?.postMessage('error');
              }
            });
          }
        }}
      />
    </SafeAreaView>
  );
};

export default WebViewScreen;
