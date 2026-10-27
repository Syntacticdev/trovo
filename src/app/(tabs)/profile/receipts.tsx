import { formatNaira } from '@/lib/booking';
import { shipments } from '@/lib/shipments';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });

const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const receiptIcon = require('@/assets/svg/icons/ic-receipt.svg');

export default function ReceiptsScreen() {
  const router = useRouter();

  // TODO: replace with the paid shipments from your API
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
          <Text className="font-sans-bold text-h2 text-ink">Receipts</Text>
          <View className="h-11 w-11" />
        </View>

        {shipments.length === 0 && (
          <Text className="mt-4 text-center font-sans text-body text-muted">Your receipts will show up here.</Text>
        )}

        {shipments.map((shipment) => (
          <Pressable
            key={shipment.id}
            // opens the shipment details, where the receipt can be printed
            onPress={() => router.push(`/shipments/${shipment.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Receipt ${shipment.id}`}
            className="flex-row items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-soft"
          >
            <View className="flex-1 flex-row items-center gap-3">
              <Image source={receiptIcon} accessible={false} className="h-6 w-6 text-accent" />
              <View className="flex-1">
                <Text className="font-sans-bold text-base text-ink">{shipment.id}</Text>
                <Text numberOfLines={1} className="font-sans text-caption text-muted">
                  To {shipment.destination} · {shipment.date}
                </Text>
              </View>
            </View>
            <Text className="font-sans-bold text-base text-ink">{formatNaira(shipment.price + shipment.pickupFee)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}