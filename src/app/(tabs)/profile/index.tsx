import { useProfile } from '@/lib/profile';
import { useSession } from '@/lib/session';
import { shipments } from '@/lib/shipments';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const editIcon = require('@/assets/svg/icons/ic-edit.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const cardIcon = require('@/assets/svg/icons/ic-card.svg');
const bellIcon = require('@/assets/svg/icons/ic-bell.svg');
const receiptIcon = require('@/assets/svg/icons/ic-receipt.svg');
const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useSession();
  const { profile, addresses, cards, defaultCardId, notifications } = useProfile();

  const defaultCard = cards.find((c) => c.id === defaultCardId);

  const rows = [
    {
      href: '/profile/addresses',
      icon: pinIcon,
      label: 'Saved addresses',
      value: `${addresses.length} ${addresses.length === 1 ? 'place' : 'places'}`,
    },
    {
      href: '/profile/payments',
      icon: cardIcon,
      label: 'Payment methods',
      value: defaultCard ? `${defaultCard.brand} ending ${defaultCard.last4}` : 'No card added',
    },
    {
      href: '/profile/notifications',
      icon: bellIcon,
      label: 'Notifications',
      value: notifications.delivery ? 'Delivery updates on' : 'Delivery updates off',
    },
    { href: '/profile/receipts', icon: receiptIcon, label: 'Receipts', value: `${shipments.length} shipments` },
  ] as const;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <ScrollView contentContainerClassName="gap-3.5 px-5 pb-6 pt-2" showsVerticalScrollIndicator={false}>
        <Text className="font-sans-bold text-h1 text-ink">Profile</Text>

        <View className="flex-row items-center gap-3 rounded-card bg-surface p-4 shadow-soft">
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} accessibilityLabel="Profile photo" className="h-14 w-14 rounded-full" />
          ) : (
            <View className="h-14 w-14 items-center justify-center rounded-full bg-accent-tint">
              <Text className="font-sans-bold text-h2 text-ink">{profile.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View className="flex-1">
            <Text numberOfLines={1} className="font-sans-bold text-base text-ink">
              {profile.name}
            </Text>
            <Text className="font-sans text-caption text-muted">{profile.phone}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile/edit')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            className="h-11 w-11 items-center justify-center rounded-full bg-canvas"
          >
            <Image source={editIcon} accessible={false} className="h-5 w-5 text-ink" />
          </Pressable>
        </View>

        {rows.map((row) => (
          <Pressable
            key={row.href}
            onPress={() => router.push(row.href)}
            accessibilityRole="button"
            className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 py-3 shadow-soft"
          >
            <Image source={row.icon} accessible={false} className="h-[22px] w-[22px] text-accent" />
            <View className="flex-1">
              <Text className="font-sans text-caption text-muted">{row.label}</Text>
              <Text numberOfLines={1} className="font-sans-bold text-base text-ink">
                {row.value}
              </Text>
            </View>
            <Image source={arrowIcon} accessible={false} className="h-4 w-4 text-muted" />
          </Pressable>
        ))}

        {/* signing out sends the user back to (auth) through the Stack.Protected guard in the root layout */}
        <Pressable
          onPress={signOut}
          accessibilityRole="button"
          className="mt-2 min-h-11 items-center justify-center"
        >
          <Text className="font-sans-bold text-caption text-danger">Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}