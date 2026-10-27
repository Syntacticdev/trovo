import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: "welcome",
};


export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', headerShadowVisible: false, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ title: "Verify number" }} />
    </Stack>
  )
}