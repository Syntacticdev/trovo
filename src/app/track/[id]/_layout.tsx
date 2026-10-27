import { Stack } from "expo-router";

export default function TrackIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        headerShown: false
      }}
    >
      <Stack.Screen name="index" options={{ title: "Live tracking" }} />
      <Stack.Screen name="delivered" options={{ title: "Delivered" }} />
    </Stack>
  );
}
