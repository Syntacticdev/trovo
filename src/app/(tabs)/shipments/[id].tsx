import { SERVICES, formatNaira } from '@/lib/booking';
import { getShipment } from '@/lib/shipments';
import { Image } from 'expo-image';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RECEIPT_PAGE, buildReceiptHtml } from '../../../lib/receipt';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(ActivityIndicator, { className: { target: 'style', nativeStyleToProp: { color: 'color' } } });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const cardIcon = require('@/assets/svg/icons/ic-card.svg');

export default function ShipmentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const shipment = getShipment(id);
  const isLoading = status === 'loading';

  const backButton = (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      className="h-11 w-11 items-center justify-center rounded-full bg-surface"
    >
      <Image source={arrowIcon} accessible={false} className="h-5 w-5 -scale-x-100 text-ink" />
    </Pressable>
  );

  if (!shipment) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 gap-3.5 bg-canvas px-5 pt-2">
        <View className="flex-row items-center justify-between">
          {backButton}
          <Text className="font-sans-bold text-h2 text-ink">Shipment details</Text>
          <View className="h-11 w-11" />
        </View>
        <Text className="mt-6 text-center font-sans text-body text-muted">We could not find this shipment.</Text>
      </SafeAreaView>
    );
  }

  const service = SERVICES.find((s) => s.id === shipment.service) ?? SERVICES[1];
  const total = shipment.price + shipment.pickupFee;
  const delivered = shipment.status === 'Delivered';

  const onDownloadReceipt = async () => {
    if (isLoading) return;
    setStatus('loading');
    try {
      const html = buildReceiptHtml(shipment);
      // opens the system print dialog (Save as PDF is available from it)
      await Print.printAsync({ html, width: RECEIPT_PAGE.width, height: RECEIPT_PAGE.height });
      setStatus('idle');
    } catch (error) {
      // closing the print dialog without printing is not a failure
      if (String(error).includes('did not complete')) {
        setStatus('idle');
        return;
      }
      console.warn('Receipt failed:', error);
      setStatus('error');
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-canvas">
      <ScrollView contentContainerClassName="gap-3.5 px-5 pb-6 pt-2" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          {backButton}
          <Text className="font-sans-bold text-h2 text-ink">Shipment details</Text>
          <View className="h-11 w-11" />
        </View>

        <View className="gap-3 rounded-card bg-surface p-4 shadow-soft">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-base text-ink">{shipment.id}</Text>
            <View className={`rounded-pill px-3 py-1 ${delivered ? 'bg-success' : 'bg-accent-tint'}`}>
              <Text className={`font-sans-bold text-caption ${delivered ? 'text-surface' : 'text-ink'}`}>
                {shipment.status}
              </Text>
            </View>
          </View>
          {[
            { label: 'From', value: shipment.from },
            { label: 'To', value: shipment.to },
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
            <Text className="font-sans-bold text-body text-ink">{formatNaira(shipment.price)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">Pickup fee</Text>
            <Text className="font-sans-bold text-body text-ink">{formatNaira(shipment.pickupFee)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-base text-ink">Paid</Text>
            <Text className="font-sans-bold text-base text-ink">{formatNaira(total)}</Text>
          </View>
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 py-3 shadow-soft">
          <Image source={cardIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Paid with</Text>
            <Text className="font-sans-bold text-base text-ink">{shipment.paidWith}</Text>
          </View>
        </View>

        {status === 'error' && (
          <Text accessibilityRole="alert" className="text-center font-sans text-caption text-danger">
            We could not create the receipt. Try again.
          </Text>
        )}

        {delivered ? (
          <Pressable
            onPress={onDownloadReceipt}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
            className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${isLoading ? 'opacity-40' : ''
              }`}
          >
            {isLoading ? (
              <ActivityIndicator className="text-surface" />
            ) : (
              <Text className="font-sans-bold text-base text-surface">Print receipt</Text>
            )}
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push(`/track/${shipment.id}`)}
            accessibilityRole="button"
            className="h-14 items-center justify-center rounded-pill bg-accent shadow-cta"
          >
            <Text className="font-sans-bold text-base text-surface">Track shipment</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}