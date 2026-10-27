import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});

// Imported assets (SVG files you drop into assets/svg/icons)
const bellIcon = require('@/assets/svg/icons/ic-bell.svg');
const searchIcon = require('@/assets/svg/icons/ic-search.svg');
const boxIcon = require('@/assets/svg/icons/ic-box.svg');
const bikeIcon = require('@/assets/svg/icons/ic-bike.svg');
const truckIcon = require('@/assets/svg/icons/ic-truck.svg');
const planeIcon = require('@/assets/svg/icons/ic-plane.svg');

const services = [
  { id: 'same-day', label: 'Same-day', icon: bikeIcon },
  { id: 'standard', label: 'Standard', icon: truckIcon },
  { id: 'express', label: 'Express', icon: planeIcon },
] as const;

// TODO: replace with your user rofile and shipments API
const userName = 'Tola';
const activeShipment = {
  id: 'TRV-48213',
  status: 'In transit',
  route: 'Ibadan to Lagos',
  eta: 'arrives today',
  progress: 0.62, // 0 to 1
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function HomeScreen() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');

  const onSearch = () => {
    const id = trackingId.trim();
    if (!id) return;
    router.push(`/track/${id}`);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <ScrollView
        contentContainerClassName="gap-3.5 px-5 pb-6 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-sans text-caption text-muted">{getGreeting()}</Text>
            <Text className="font-sans-bold text-h2 text-ink">Hi {userName}</Text>
          </View>
          <Pressable
            // TODO: open your notifications inbox once that screen exists
            onPress={() => { }}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            className="h-11 w-11 items-center justify-center rounded-full bg-surface shadow-soft"
          >
            <Image source={bellIcon} accessible={false} className="h-[22px] w-[22px] text-ink" />
          </Pressable>
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={searchIcon} accessible={false} className="h-[22px] w-[22px] text-muted" />
          <TextInput
            value={trackingId}
            onChangeText={setTrackingId}
            onSubmitEditing={onSearch}
            placeholder="Enter tracking ID"
            placeholderClassName="text-muted"
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Tracking ID"
            className="flex-1 py-3 font-sans text-base text-ink"
          />
        </View>

        <View className="gap-1 rounded-card bg-ink p-5">
          <Text className="font-sans-bold text-base text-surface">Send a package</Text>
          <Text className="mb-3 font-sans text-body text-canvas">Pickup from your door today.</Text>
          <Pressable
            onPress={() => router.push('/ship')}
            accessibilityRole="button"
            className="min-h-11 flex-row items-center gap-2 self-start rounded-pill bg-surface px-4 py-2.5"
          >
            <Image source={boxIcon} accessible={false} className="h-[18px] w-[18px] text-accent" />
            <Text className="font-sans-bold text-caption text-ink">New shipment</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push(`/track/${activeShipment.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Track shipment ${activeShipment.id}`}
          className="gap-2 rounded-card bg-surface p-4 shadow-soft"
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-base text-ink">{activeShipment.id}</Text>
            <View className="rounded-pill bg-accent-tint px-3 py-1">
              <Text className="font-sans-bold text-caption text-ink">{activeShipment.status}</Text>
            </View>
          </View>
          <Text className="font-sans text-body text-muted">
            {activeShipment.route} · {activeShipment.eta}
          </Text>
          <View className="h-2 overflow-hidden rounded-pill bg-canvas">
            <View
              className="h-2 rounded-pill bg-accent"
              style={{ width: `${Math.round(activeShipment.progress * 100)}%` }}
            />
          </View>
        </Pressable>

        <Text className="mt-1 font-sans-bold text-base text-ink">Services</Text>
        <View className="flex-row gap-3">
          {services.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => router.push({ pathname: '/ship', params: { service: service.id } })}
              accessibilityRole="button"
              accessibilityLabel={`Ship ${service.label}`}
              className="min-h-11 flex-1 items-center gap-1.5 rounded-field bg-surface px-2 py-3.5"
            >
              <Image source={service.icon} accessible={false} className="h-6 w-6 text-accent" />
              <Text className="font-sans-bold text-caption text-ink">{service.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}