import { useProfile, type NotificationKey } from '@/lib/profile';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');

const options: { key: NotificationKey; title: string; description: string }[] = [
  { key: 'delivery', title: 'Delivery updates', description: 'Pickup, transit and arrival' },
  { key: 'receipts', title: 'Payment receipts', description: 'Sent after every booking' },
  { key: 'offers', title: 'Offers and tips', description: 'Discounts on shipping' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, setNotification } = useProfile();

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
          <Text className="font-sans-bold text-h2 text-ink">Notifications</Text>
          <View className="h-11 w-11" />
        </View>

        <Text className="text-center font-sans text-caption text-muted">Changes save automatically.</Text>

        {options.map((option) => {
          const on = notifications[option.key];
          return (
            <Pressable
              key={option.key}
              // TODO: also save the change to your API (and register push permissions when turning one on)
              onPress={() => setNotification(option.key, !on)}
              accessibilityRole="switch"
              accessibilityLabel={option.title}
              accessibilityState={{ checked: on }}
              className="min-h-14 flex-row items-center justify-between gap-3 rounded-field bg-surface px-4 py-3 shadow-soft"
            >
              <View className="flex-1">
                <Text className="font-sans-bold text-base text-ink">{option.title}</Text>
                <Text className="font-sans text-caption text-muted">{option.description}</Text>
              </View>
              <View className={`h-7 w-12 rounded-pill ${on ? 'bg-success' : 'bg-muted'}`}>
                <View
                  className={`absolute left-[3px] top-[3px] h-[22px] w-[22px] rounded-full bg-surface ${on ? 'translate-x-5' : ''
                    }`}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}