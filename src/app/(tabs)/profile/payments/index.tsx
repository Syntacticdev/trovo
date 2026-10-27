import { useProfile } from '@/lib/profile';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const cardIcon = require('@/assets/svg/icons/ic-card.svg');
const plusIcon = require('@/assets/svg/icons/ic-plus.svg');

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { cards, defaultCardId, setDefaultCard } = useProfile();

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
          <Text className="font-sans-bold text-h2 text-ink">Payment methods</Text>
          <View className="h-11 w-11" />
        </View>

        {cards.length === 0 && (
          <Text className="mt-4 text-center font-sans text-body text-muted">You have not added a card yet.</Text>
        )}

        {cards.map((card) => {
          const isDefault = card.id === defaultCardId;
          return (
            <View key={card.id} className="flex-row items-center gap-3 rounded-card bg-surface p-4 shadow-soft">
              <Image source={cardIcon} accessible={false} className="h-[26px] w-[26px] text-accent" />
              <View className="flex-1">
                <Text className="font-sans-bold text-base text-ink">
                  {card.brand} ending {card.last4}
                </Text>
                <Text className="font-sans text-caption text-muted">Expires {card.expiry}</Text>
              </View>
              {isDefault ? (
                <View className="rounded-pill bg-success px-3 py-1">
                  <Text className="font-sans-bold text-caption text-surface">Default</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => setDefaultCard(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Make ${card.brand} ending ${card.last4} the default card`}
                  className="min-h-11 justify-center rounded-pill bg-accent-tint px-3"
                >
                  <Text className="font-sans-bold text-caption text-ink">Set default</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        <Pressable
          onPress={() => router.push('/profile/payments/add')}
          accessibilityRole="button"
          className="h-14 flex-row items-center justify-center gap-2 rounded-pill bg-accent shadow-cta"
        >
          <Image source={plusIcon} accessible={false} className="h-5 w-5 text-surface" />
          <Text className="font-sans-bold text-base text-surface">Add card</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}