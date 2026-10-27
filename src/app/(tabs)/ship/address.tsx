import { useBooking } from '@/lib/booking';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Let className work on these components. For Image, a text color class
// (text-accent, text-ink) becomes its tintColor.
cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});

// Imported assets (SVG files you drop into assets/svg/icons)
const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const searchIcon = require('@/assets/svg/icons/ic-search.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const homeIcon = require('@/assets/svg/icons/ic-home.svg');
const boxIcon = require('@/assets/svg/icons/ic-box.svg');
const clockIcon = require('@/assets/svg/icons/ic-clock.svg');

// TODO: saved addresses come from the profile API, recent ones from past shipments
const saved = [
  { label: 'Home', address: '12 Ring Rd, Ibadan', icon: homeIcon },
  { label: 'Office', address: '44 Adeola Odeku, Lagos', icon: boxIcon },
];
const recent = [
  { label: 'Allen Ave, Ikeja', address: 'Allen Ave, Ikeja, Lagos', icon: clockIcon },
  { label: 'Wuse 2', address: 'Wuse 2, Abuja', icon: clockIcon },
];

export default function PickAddressScreen() {
  const router = useRouter();
  const { update } = useBooking();
  const { field } = useLocalSearchParams<{ field?: 'pickup' | 'dropoff' }>();
  const [query, setQuery] = useState('');

  const target = field === 'pickup' ? 'pickup' : 'dropoff';
  const title = target === 'pickup' ? 'Pickup address' : 'Drop-off address';

  const q = query.trim().toLowerCase();
  const matches = (item: { label: string; address: string }) =>
    !q || item.label.toLowerCase().includes(q) || item.address.toLowerCase().includes(q);

  const select = (address: string) => {
    update({ [target]: address });
    router.back();
  };

  const renderRow = (item: { label: string; address: string; icon: number }) => (
    <Pressable
      key={item.label}
      onPress={() => select(item.address)}
      accessibilityRole="button"
      className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 py-3 shadow-soft"
    >
      <Image source={item.icon} accessible={false} className="h-[22px] w-[22px] text-accent" />
      <View className="flex-1">
        <Text className="font-sans-bold text-base text-ink">{item.label}</Text>
        <Text numberOfLines={1} className="font-sans text-caption text-muted">
          {item.address}
        </Text>
      </View>
    </Pressable>
  );

  const savedMatches = saved.filter(matches);
  const recentMatches = recent.filter(matches);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-canvas">
      <ScrollView
        contentContainerClassName="gap-3.5 px-5 pb-6 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
          >
            <Image source={arrowIcon} accessible={false} className="h-5 w-5 -scale-x-100 text-ink" />
          </Pressable>
          <Text className="font-sans-bold text-h2 text-ink">{title}</Text>
          <View className="h-11 w-11" />
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={searchIcon} accessible={false} className="h-[22px] w-[22px] text-muted" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search street or area"
            placeholderClassName="text-muted"
            autoFocus
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => query.trim() && select(query.trim())}
            accessibilityLabel="Search address"
            className="flex-1 py-3 font-sans text-base text-ink"
          />
        </View>

        {query.trim().length > 0 && (
          <Pressable
            onPress={() => select(query.trim())}
            accessibilityRole="button"
            className="min-h-14 flex-row items-center gap-3 rounded-field bg-accent-tint px-4 py-3"
          >
            <Image source={pinIcon} accessible={false} className="h-[22px] w-[22px] text-ink" />
            <Text numberOfLines={1} className="flex-1 font-sans-bold text-base text-ink">
              Use “{query.trim()}”
            </Text>
          </Pressable>
        )}

        {savedMatches.length > 0 && (
          <>
            <Text className="mt-1 font-sans-bold text-base text-ink">Saved</Text>
            {savedMatches.map(renderRow)}
          </>
        )}

        {recentMatches.length > 0 && (
          <>
            <Text className="mt-1 font-sans-bold text-base text-ink">Recent</Text>
            {recentMatches.map(renderRow)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}