import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Screen } from '@/constants/screens';
import WebViewScreen, {
  type WebViewScreenParams,
} from '@/screens/WebViewScreen';
import {
  DefaultTheme,
  NavigationContainer,
  RouteProp,
} from '@react-navigation/native';

export type RootStackParamsList = {
  [Screen.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<RootStackParamsList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
};

export type RootNavigatorScreenNP<T extends keyof RootStackParamsList> =
  NativeStackNavigationProp<RootStackParamsList, T>;
export type RootNavigatorScreenRP<T extends keyof RootStackParamsList> =
  RouteProp<RootStackParamsList, T>;

const RootNavigator = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={Screen.WebViewScreen}
          component={WebViewScreen}
          initialParams={{ url: 'https://manyaak-front.pages.dev' }}
          getId={({ params }) => params.url}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
