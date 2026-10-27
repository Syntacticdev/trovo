import { useProfile } from '@/lib/profile';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(ActivityIndicator, { className: { target: 'style', nativeStyleToProp: { color: 'color' } } });
cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const cardIcon = require('@/assets/svg/icons/ic-card.svg');
const userIcon = require('@/assets/svg/icons/ic-user.svg');
const shieldIcon = require('@/assets/svg/icons/ic-shield.svg');

// "4111111111111111" -> "4111 1111 1111 1111"
const formatNumber = (digits: string) => digits.replace(/(\d{4})(?=\d)/g, '$1 ');
// "0828" -> "08/28"
const formatExpiry = (digits: string) => (digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);

// Luhn check: catches most typing mistakes before the card is sent anywhere
function passesLuhn(number: string) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let digit = Number(number[number.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return number.length > 0 && sum % 10 === 0;
}

function isExpiryValid(digits: string) {
  if (digits.length !== 4) return false;
  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2));
  const now = new Date();
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

const detectBrand = (number: string) => (number.startsWith('4') ? 'Visa' : /^(5|2[2-7])/.test(number) ? 'Mastercard' : 'Card');

// TODO: send the card details to your payment provider (Paystack, Flutterwave, Stripe ...) from here
// and keep only the token and the last 4 digits it returns. Never store or log the full number or the CVV.
async function tokenizeCard(_card: { number: string; expiry: string; cvv: string; name: string }) {
  await new Promise((resolve) => setTimeout(resolve, 700));
}

export default function AddCardScreen() {
  const router = useRouter();
  const { addCard } = useProfile();
  const [number, setNumber] = useState(''); // digits only
  const [expiry, setExpiry] = useState(''); // digits only
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const isValid =
    number.length === 16 && passesLuhn(number) && isExpiryValid(expiry) && cvv.length >= 3 && name.trim().length > 1;
  const isLoading = status === 'loading';

  const onSave = async () => {
    if (!isValid || isLoading) return;
    setStatus('loading');
    try {
      await tokenizeCard({ number, expiry, cvv, name: name.trim() });
      addCard({ brand: detectBrand(number), last4: number.slice(-4), expiry: formatExpiry(expiry) });
      router.back();
    } catch {
      setStatus('error');
    }
  };

  const digitsOnly = (text: string, max: number) => text.replace(/\D/g, '').slice(0, max);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-canvas">
      <ScrollView
        contentContainerClassName="gap-3.5 px-5 pb-6 pt-2"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
          >
            <Image source={arrowIcon} accessible={false} className="h-5 w-5 -scale-x-100 text-ink" />
          </Pressable>
          <Text className="font-sans-bold text-h2 text-ink">Add card</Text>
          <View className="h-11 w-11" />
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={cardIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Card number</Text>
            <TextInput
              value={formatNumber(number)}
              onChangeText={(t) => setNumber(digitsOnly(t, 16))}
              placeholder="0000 0000 0000 0000"
              placeholderClassName="text-muted"
              keyboardType="number-pad"
              textContentType="creditCardNumber"
              autoComplete="cc-number"
              accessibilityLabel="Card number"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="min-h-14 flex-1 justify-center rounded-field bg-surface px-4 shadow-soft">
            <Text className="font-sans text-caption text-muted">Expiry</Text>
            <TextInput
              value={formatExpiry(expiry)}
              onChangeText={(t) => setExpiry(digitsOnly(t, 4))}
              placeholder="MM/YY"
              placeholderClassName="text-muted"
              keyboardType="number-pad"
              autoComplete="cc-exp"
              accessibilityLabel="Expiry date"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
          <View className="min-h-14 flex-1 justify-center rounded-field bg-surface px-4 shadow-soft">
            <Text className="font-sans text-caption text-muted">CVV</Text>
            <TextInput
              value={cvv}
              onChangeText={(t) => setCvv(digitsOnly(t, 4))}
              placeholder="000"
              placeholderClassName="text-muted"
              keyboardType="number-pad"
              secureTextEntry
              autoComplete="cc-csc"
              accessibilityLabel="CVV"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={userIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Name on card</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tola Adeyemi"
              placeholderClassName="text-muted"
              autoCapitalize="words"
              textContentType="name"
              accessibilityLabel="Name on card"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
        </View>

        <View className="flex-row items-center gap-2.5">
          <Image source={shieldIcon} accessible={false} className="h-5 w-5 text-accent" />
          <Text className="flex-1 font-sans text-caption text-muted">Card details are encrypted and never shared.</Text>
        </View>

        {status === 'error' && (
          <Text accessibilityRole="alert" className="text-center font-sans text-caption text-danger">
            We could not save this card. Check the details and try again.
          </Text>
        )}

        <Pressable
          onPress={onSave}
          disabled={!isValid || isLoading}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid || isLoading, busy: isLoading }}
          className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${isValid && !isLoading ? '' : 'opacity-40'
            }`}
        >
          {isLoading ? (
            <ActivityIndicator className="text-surface" />
          ) : (
            <Text className="font-sans-bold text-base text-surface">Save card</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}