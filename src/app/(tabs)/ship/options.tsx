import { SERVICES, formatNaira, useBooking, type ServiceId } from '@/lib/booking';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const checkIcon = require('@/assets/svg/icons/ic-check.svg');
const bikeIcon = require('@/assets/svg/icons/ic-bike.svg');
const planeIcon = require('@/assets/svg/icons/ic-plane.svg');
const truckIcon = require('@/assets/svg/icons/ic-truck.svg');

const serviceIcons: Record<ServiceId, number> = {
  'same-day': bikeIcon,
  express: planeIcon,
  standard: truckIcon,
};

export default function DeliveryOptionsScreen() {
  const router = useRouter();
  const { draft, update } = useBooking();

  // opened directly (deep link) without the package details
  if (!draft.pickup || !draft.dropoff) return <Redirect href="/ship" />;

  const sizeLabel = draft.size.charAt(0).toUpperCase() + draft.size.slice(1);

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
          <Text className="font-sans-bold text-h2 text-ink">Choose service</Text>
          <View className="h-11 w-11" />
        </View>

        <Text className="text-center font-sans text-body text-muted">
          {sizeLabel} · {draft.weight} kg
        </Text>

        {SERVICES.map((service) => {
          const selected = draft.service === service.id;
          return (
            <Pressable
              key={service.id}
              onPress={() => update({ service: service.id })}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={`flex-row items-center justify-between rounded-card border-2 p-4 shadow-soft ${selected ? 'border-accent bg-accent-tint' : 'border-transparent bg-surface'
                }`}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <Image source={serviceIcons[service.id]} accessible={false} className="h-[26px] w-[26px] text-accent" />
                <View className="flex-1">
                  <Text className="font-sans-bold text-base text-ink">{service.label}</Text>
                  <Text className="font-sans text-caption text-muted">{service.eta}</Text>
                </View>
              </View>
              <Text className="font-sans-bold text-base text-ink">{formatNaira(service.price)}</Text>
            </Pressable>
          );
        })}

        <View className="flex-row items-center gap-2.5">
          <Image source={checkIcon} accessible={false} className="h-5 w-5 text-accent" />
          <Text className="flex-1 font-sans text-caption text-muted">Insurance up to ₦100,000 included</Text>
        </View>

        <Pressable
          onPress={() => router.push('/ship/review')}
          accessibilityRole="button"
          className="h-14 flex-row items-center justify-center gap-2 rounded-pill bg-accent shadow-cta"
        >
          <Text className="font-sans-bold text-base text-surface">Continue</Text>
          <Image source={arrowIcon} accessible={false} className="h-5 w-5 text-surface" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}