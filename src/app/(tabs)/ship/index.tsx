import { SERVICES, useBooking, type Size } from '@/lib/booking';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const boxIcon = require('@/assets/svg/icons/ic-box.svg');
const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');

const sizes: { id: Size; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];

export default function PackageDetailsScreen() {
  const router = useRouter();
  const { draft, update } = useBooking();
  // The Home screen can open this screen with ?service=same-day|express|standard
  const { service } = useLocalSearchParams<{ service?: string }>();

  useEffect(() => {
    const match = SERVICES.find((s) => s.id === service);
    if (match) update({ service: match.id });
  }, [service, update]);

  const isValid = !!draft.pickup && !!draft.dropoff && parseFloat(draft.weight) > 0;

  const onChangeWeight = (text: string) => {
    // digits and a single dot only
    const [whole, ...rest] = text.replace(/[^0-9.]/g, '').split('.');
    update({ weight: rest.length ? `${whole}.${rest.join('')}` : whole });
  };

  const addressFields = [
    { field: 'pickup', label: 'Pickup', value: draft.pickup, placeholder: 'Choose pickup address' },
    { field: 'dropoff', label: 'Drop-off', value: draft.dropoff, placeholder: 'Choose drop-off address' },
  ] as const;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <ScrollView
        contentContainerClassName="gap-3.5 px-5 pb-6 pt-2"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className='gap-3'>
          <Text className="font-sans-bold text-h1 text-ink">New shipment</Text>
          <Text className="font-sans text-body text-muted">Step 1 of 3 · Where and what</Text>
        </View>

        {addressFields.map((item) => (
          <Pressable
            key={item.field}
            onPress={() => router.push({ pathname: '/ship/address', params: { field: item.field } })}
            accessibilityRole="button"
            accessibilityLabel={`${item.label} address`}
            className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 py-3 shadow-soft"
          >
            <Image source={pinIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
            <View className="flex-1">
              <Text className="font-sans text-caption text-muted">{item.label}</Text>
              <Text
                numberOfLines={1}
                className={`font-sans-bold text-base ${item.value ? 'text-ink' : 'text-muted'}`}
              >
                {item.value || item.placeholder}
              </Text>
            </View>
          </Pressable>
        ))}

        <Text className="mt-1 font-sans-bold text-base text-ink">Package size</Text>
        <View className="flex-row gap-3">
          {sizes.map((size) => {
            const selected = draft.size === size.id;
            return (
              <Pressable
                key={size.id}
                onPress={() => update({ size: size.id })}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                className={`min-h-11 flex-1 items-center justify-center rounded-pill py-3 ${selected ? 'bg-ink' : 'bg-surface'
                  }`}
              >
                <Text className={`font-sans-bold text-caption ${selected ? 'text-surface' : 'text-ink'}`}>
                  {size.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={boxIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Weight</Text>
            <TextInput
              value={draft.weight}
              onChangeText={onChangeWeight}
              placeholder="0"
              keyboardType="decimal-pad"
              maxLength={6}
              accessibilityLabel="Weight in kilograms"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
          <Text className="font-sans-bold text-base text-muted">kg</Text>
        </View>

        <Pressable
          onPress={() => router.push('/ship/options')}
          disabled={!isValid}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-pill bg-accent shadow-cta ${isValid ? '' : 'opacity-40'
            }`}
        >
          <Text className="font-sans-bold text-base text-surface">See delivery options</Text>
          <Image source={arrowIcon} accessible={false} className="h-5 w-5 text-surface" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}