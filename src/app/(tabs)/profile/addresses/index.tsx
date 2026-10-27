import { useProfile, type AddressLabel } from '@/lib/profile';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const editIcon = require('@/assets/svg/icons/ic-edit.svg');
const homeIcon = require('@/assets/svg/icons/ic-home.svg');
const boxIcon = require('@/assets/svg/icons/ic-box.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const plusIcon = require('@/assets/svg/icons/ic-plus.svg');

const labelIcons: Record<AddressLabel, number> = { Home: homeIcon, Office: boxIcon, Other: pinIcon };

export default function SavedAddressesScreen() {
  const router = useRouter();
  const { addresses } = useProfile();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-canvas">
      <ScrollView contentContainerClassName="gap-3.5 px-5 pb-6 pt-2" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
          >
            <Image source={arrowIcon} accessible={false} className="h-5 w-5 -scale-x-100 text-ink" />
          </Pressable>
          <Text className="font-sans-bold text-h2 text-ink">Saved addresses</Text>
          <View className="h-11 w-11" />
        </View>

        {addresses.length === 0 && (
          <Text className="mt-4 text-center font-sans text-body text-muted">You have no saved addresses yet.</Text>
        )}

        {addresses.map((address) => (
          <View key={address.id} className="flex-row items-center gap-3 rounded-card bg-surface p-4 shadow-soft">
            <Image source={labelIcons[address.label]} accessible={false} className="h-6 w-6 text-accent" />
            <View className="flex-1">
              <Text className="font-sans-bold text-base text-ink">{address.label}</Text>
              <Text numberOfLines={1} className="font-sans text-caption text-muted">
                {address.street}, {address.city}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push(`/profile/addresses/${address.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${address.label} address`}
              className="h-11 w-11 items-center justify-center rounded-full bg-canvas"
            >
              <Image source={editIcon} accessible={false} className="h-5 w-5 text-ink" />
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={() => router.push('/profile/addresses/new')}
          accessibilityRole="button"
          className="h-14 flex-row items-center justify-center gap-2 rounded-pill bg-accent shadow-cta"
        >
          <Image source={plusIcon} accessible={false} className="h-5 w-5 text-surface" />
          <Text className="font-sans-bold text-base text-surface">Add new address</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}