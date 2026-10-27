import '../global.css';

import AnimatedSplash from '@/components/animated-splash';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SessionProvider, useSession } from '../lib/session';

SplashScreen.preventAutoHideAsync();


function Routes() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session} redirectTo="/welcome">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="track" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });


  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    const timer = setTimeout(() => SplashScreen.hideAsync(), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <SessionProvider>
      <StatusBar style={splashDone ? 'dark' : 'light'} />
      <Routes />
      {!splashDone && (
        <AnimatedSplash onReady={() => SplashScreen.hideAsync()} onFinish={() => setSplashDone(true)} />
      )}
    </SessionProvider>
  );
}