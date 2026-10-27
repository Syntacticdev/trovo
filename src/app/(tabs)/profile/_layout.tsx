import { ProfileProvider } from '@/lib/profile';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileProvider>
  );
}