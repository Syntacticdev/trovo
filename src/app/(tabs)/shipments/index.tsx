import type { ServiceId } from '@/lib/booking';
import { shipments } from '@/lib/shipments';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const bikeIcon = require('@/assets/svg/icons/ic-bike.svg');
const planeIcon = require('@/assets/svg/icons/ic-plane.svg');
const truckIcon = require('@/assets/svg/icons/ic-truck.svg');

const serviceIcons: Record<ServiceId, number> = {
  'same-day': bikeIcon,
  express: planeIcon,
  standard: truckIcon,
};

const tabs = ['Active', 'Past'] as const;

export default function ShipmentsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>('Active');

  // Active = not delivered yet
  const data = shipments.filter((s) => (s.status !== 'Delivered') === (tab === 'Active'));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3.5 px-5 pb-6 pt-2"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3.5">
            <Text className="font-sans-bold text-h1 text-ink">Shipments</Text>
            <View className="flex-row gap-3">
              {tabs.map((name) => {
                const selected = tab === name;
                return (
                  <Pressable
                    key={name}
                    onPress={() => setTab(name)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    className={`min-h-11 flex-1 items-center justify-center rounded-pill py-3 ${selected ? 'bg-ink' : 'bg-surface'
                      }`}
                  >
                    <Text className={`font-sans-bold text-caption ${selected ? 'text-surface' : 'text-ink'}`}>
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-6 text-center font-sans text-body text-muted">
            {tab === 'Active' ? 'No active shipments.' : 'No past shipments yet.'}
          </Text>
        }
        renderItem={({ item }) => {
          const delivered = item.status === 'Delivered';
          return (
            <Pressable
              // active shipments open live tracking, delivered ones open the receipt
              onPress={() => router.push(delivered ? `/shipments/${item.id}` : `/track/${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${item.id}, ${item.status}`}
              className="flex-row items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-soft"
            >
              <View className="flex-1 flex-row items-center gap-3">
                <Image source={serviceIcons[item.service]} accessible={false} className="h-6 w-6 text-accent" />
                <View className="flex-1">
                  <Text className="font-sans-bold text-base text-ink">{item.id}</Text>
                  <Text numberOfLines={1} className="font-sans text-caption text-muted">
                    To {item.destination}
                  </Text>
                </View>
              </View>
              <View className={`rounded-pill px-3 py-1 ${delivered ? 'bg-success' : 'bg-accent-tint'}`}>
                <Text className={`font-sans-bold text-caption ${delivered ? 'text-surface' : 'text-ink'}`}>
                  {item.status}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}