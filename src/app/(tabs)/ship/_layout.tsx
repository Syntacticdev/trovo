import { Stack } from 'expo-router';
import { BookingProvider } from '../../../lib/booking';

export default function ShipLayout() {
  return (
    <BookingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* no swipe back from the confirmation, so a payment is never repeated */}
        <Stack.Screen name="booked" options={{ gestureEnabled: false }} />
      </Stack>
    </BookingProvider>
  );
}