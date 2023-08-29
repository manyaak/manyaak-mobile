import RootNavigator from '@/routes/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const onLayout = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    const init = async () => {
      try {
        const updateCheckResult = await Updates.checkForUpdateAsync();
        if (updateCheckResult.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          return;
        }
      } catch (error) {
        console.log(error);
      }

      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <RootNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
