import { Stack } from "expo-router";

export default function ShipmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Shipments" }} />
      <Stack.Screen name="[id]" options={{ title: "Shipment details" }} />
    </Stack>
  );
}
