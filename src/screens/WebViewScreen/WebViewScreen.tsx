import { Screen } from '@/constants/screens';
import {
  RootNavigatorScreenNP,
  RootNavigatorScreenRP,
} from '@/routes/RootNavigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { styles } from './WebViewScreen.style';
import { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import * as AppleLogin from 'expo-apple-authentication';
import { View } from 'react-native';

export type WebViewScreenParams = {
  url: string;
};

type WebViewScreenRP = RootNavigatorScreenRP<Screen.WebViewScreen>;
type WebViewScreenNP = RootNavigatorScreenNP<Screen.WebViewScreen>;

const loginWithKakao = async () => {
  try {
    const token = (await KakaoLogin.login()) as KakaoLogin.KakaoOAuthToken;
    console.log(token.idToken);
    return token.idToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const loginWithApple = async () => {
  try {
    const credential = await AppleLogin.signInAsync({
      requestedScopes: [
        AppleLogin.AppleAuthenticationScope.EMAIL,
        AppleLogin.AppleAuthenticationScope.FULL_NAME,
      ],
    });
    console.log(credential);
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
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  return (
    <View
      style={[
        styles.webView,
        {
          borderTopWidth: top,
          paddingBottom: bottom,
          borderTopColor: backgroundColor,
        },
      ]}
    >
      <WebView
        ref={ref}
        source={{ uri: params.url }}
        style={[styles.webView, { backgroundColor }]}
        injectedJavaScriptBeforeContentLoaded={`
          window.isReactNativeApp = true;
          window.safeAreaInsets = {
            top: ${top},
            bottom: ${bottom},
          };
        `}
        domStorageEnabled
        textInteractionEnabled={false}
        showsVerticalScrollIndicator={false}
        onMessage={(e) => {
          const message = e.nativeEvent.data;
          console.log(message);

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
                console.log(idToken);
                ref.current?.postMessage(idToken);
              } else {
                ref.current?.postMessage('error');
              }
            });
          } else {
            try {
              const parsedMessage = JSON.parse(message);
              if (parsedMessage.backgroundColor) {
                setBackgroundColor(parsedMessage.backgroundColor);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }}
      />
    </View>
  );
};

export default WebViewScreen;
