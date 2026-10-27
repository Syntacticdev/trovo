import { PICKUP_FEE, SERVICES, formatNaira, useBooking } from '@/lib/booking';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(ActivityIndicator, { className: { target: 'style', nativeStyleToProp: { color: 'color' } } });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const cardIcon = require('@/assets/svg/icons/ic-card.svg');

// TODO: replace with your payment API. Returns the new tracking ID, throws if the payment fails.
async function payForShipment(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return `TRV-${Math.floor(10000 + Math.random() * 90000)}`;
}

export default function ReviewAndPayScreen() {
  const router = useRouter();
  const { draft } = useBooking();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  // opened directly (deep link) without the package details
  if (!draft.pickup || !draft.dropoff) return <Redirect href="/ship" />;

  const service = SERVICES.find((s) => s.id === draft.service) ?? SERVICES[1];
  const total = service.price + PICKUP_FEE;
  const isLoading = status === 'loading';

  const onPay = async () => {
    if (isLoading) return;
    setStatus('loading');
    try {
      const id = await payForShipment();
      // replace so Back from the confirmation never returns to the payment
      router.replace({ pathname: '/ship/booked', params: { id } });
    } catch {
      setStatus('error');
    }
  };

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
          <Text className="font-sans-bold text-h2 text-ink">Review and pay</Text>
          <View className="h-11 w-11" />
        </View>

        <View className="gap-3 rounded-card bg-surface p-4 shadow-soft">
          {[
            { label: 'From', value: draft.pickup },
            { label: 'To', value: draft.dropoff },
          ].map((row) => (
            <View key={row.label} className="flex-row items-center gap-3">
              <Image source={pinIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
              <View className="flex-1">
                <Text className="font-sans text-caption text-muted">{row.label}</Text>
                <Text numberOfLines={1} className="font-sans-bold text-base text-ink">
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="gap-2 rounded-card bg-surface p-4 shadow-soft">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">{service.label} delivery</Text>
            <Text className="font-sans-bold text-body text-ink">{formatNaira(service.price)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">Pickup fee</Text>
            <Text className="font-sans-bold text-body text-ink">{formatNaira(PICKUP_FEE)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-base text-ink">Total</Text>
            <Text className="font-sans-bold text-h2 text-ink">{formatNaira(total)}</Text>
          </View>
        </View>

        {/* TODO: show the default payment method from the profile */}
        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 py-3 shadow-soft">
          <Image source={cardIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Pay with</Text>
            <Text className="font-sans-bold text-base text-ink">Visa ending 4417</Text>
          </View>
        </View>

        {status === 'error' && (
          <Text accessibilityRole="alert" className="text-center font-sans text-caption text-danger">
            The payment did not go through. Try again.
          </Text>
        )}

        <Pressable
          onPress={onPay}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
          className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${isLoading ? 'opacity-40' : ''
            }`}
        >
          {isLoading ? (
            <ActivityIndicator className="text-surface" />
          ) : (
            <Text className="font-sans-bold text-base text-surface">Pay {formatNaira(total)}</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}