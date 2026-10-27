import { SERVICES, useBooking } from '@/lib/booking';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Let className work on these components. For Image, a text color class
// (text-surface) becomes its tintColor.
cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });

// Imported assets (SVG files you drop into assets/svg)
const successIllustration = require('@/assets/svg/illustrations/ill-success.svg');
const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');

export default function BookedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { draft, reset } = useBooking();
  // keep what was booked, because reset() clears the draft when the user leaves
  const [booked] = useState(draft);

  // opened directly (deep link) without a booking
  if (!id) return <Redirect href="/ship" />;

  const service = SERVICES.find((s) => s.id === booked.service) ?? SERVICES[1];

  // The ship stack stays mounted inside the tabs, so pop it back to its first
  // screen and clear the draft. The next booking then starts empty.
  const leave = (go: () => void) => {
    router.dismissAll();
    go();
    reset();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-canvas">
      <ScrollView
        contentContainerClassName="grow gap-3.5 px-5 pb-6 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={successIllustration}
          contentFit="contain"
          accessibilityLabel="Booking confirmed"
          className="mb-1 mt-8 h-[150px] w-[150px] self-center"
        />

        <Text className="text-center font-sans-bold text-h1 text-ink">Parcel Booked</Text>
        {/* TODO: use the pickup window returned by your API */}
        <Text className="text-center font-sans text-body text-muted">
          Your courier collects between 2 and 4 pm today.
        </Text>

        <View className="gap-2 rounded-card bg-surface p-4 shadow-soft">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">Tracking ID</Text>
            <Text className="font-sans-bold text-body text-ink">{id}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">Delivery</Text>
            <Text className="font-sans-bold text-body text-ink">{service.delivery}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => leave(() => router.push(`/track/${id}`))}
          accessibilityRole="button"
          className="h-14 flex-row items-center justify-center gap-2 rounded-pill bg-accent shadow-cta"
        >
          <Text className="font-sans-bold text-base text-surface">Track shipment</Text>
          <Image source={arrowIcon} accessible={false} className="h-5 w-5 text-surface" />
        </Pressable>

        <Pressable
          onPress={() => leave(() => router.navigate('/'))}
          accessibilityRole="button"
          className="min-h-11 items-center justify-center"
        >
          <Text className="font-sans-bold text-caption text-accent">Back to home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}