import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(LinearGradient, { className: 'style' });
// text-muted on placeholderClassName becomes the placeholderTextColor prop
cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});
cssInterop(SafeAreaView, { className: 'style' });


const logoMark = require('@/assets/svg/brand/logo-mark.svg');
const parcelStack = require('@/assets/svg/illustrations/ill-parcel-stack.svg');
const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');


const WASH_GRADIENT = ['#FFD8C2', '#F6F7F9'] as const;

const COUNTRY_CODE = '+234';
const PHONE_LENGTH = 10; // Nigerian mobile number without the leading 0

// "8012345678" -> "801 234 5678"
const formatPhone = (d: string) => [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');

export default function WelcomeScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInputInstance>(null);
  const [digits, setDigits] = useState('');

  const isValid = digits.length === PHONE_LENGTH;

  const onChangePhone = (text: string) => {
    // keep digits only, drop a leading 0 (08012345678 -> 8012345678)
    setDigits(text.replace(/\D/g, '').replace(/^0/, '').slice(0, PHONE_LENGTH));
  };

  const onContinue = () => {
    if (!isValid) return;
    // TODO: request the OTP from your API here before navigating
    router.push({ pathname: '/verify', params: { phone: `${COUNTRY_CODE}${digits}` } });
  };

  return (
    <View className="flex-1 bg-canvas">
      <LinearGradient
        colors={WASH_GRADIENT}
        pointerEvents="none"
        className="absolute inset-x-0 top-0 h-[55%]"
      />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerClassName="grow gap-3.5 px-6 pb-8 pt-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row items-center gap-2.5">
              <Image source={logoMark} contentFit="contain" accessible={false} className="h-10 w-10" />
              <Text className="font-sans-bold text-h2 text-ink">Trovo</Text>
            </View>

            <Image
              source={parcelStack}
              contentFit="contain"
              accessibilityLabel="Stack of parcels"
              className="my-[18px] h-[204px] w-[260px] self-center"
            />

            <Text className="text-center font-sans-bold text-h1 text-ink">
              Ship Anything, <Text className="text-accent">Anywhere</Text>
            </Text>
            <Text className="text-center font-sans text-body text-muted">
              Book a courier in minutes and follow every parcel live.
            </Text>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="min-h-16 rounded-field bg-surface p-4 shadow-soft"
            >
              <Text className="font-sans text-caption  text-muted">Phone number</Text>
              <View className='flex-row items-center gap-3'>
                <Text className="font-sans-bold text-base text-ink font-sans-bold">{COUNTRY_CODE}</Text>
                <View className="flex-1">
                  <TextInput
                    ref={inputRef}
                    value={formatPhone(digits)}
                    onChangeText={onChangePhone}
                    placeholder="801 234 5678"
                    placeholderClassName="text-muted"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    returnKeyType="done"
                    onSubmitEditing={onContinue}
                    maxLength={PHONE_LENGTH + 2}
                    accessibilityLabel="Phone number"
                    className="py-0.5 font-sans-bold text-base text-ink"
                  />
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={onContinue}
              disabled={!isValid}
              accessibilityRole="button"
              accessibilityState={{ disabled: !isValid }}
              className={`h-14 flex-row items-center justify-center gap-2 rounded-pill bg-accent shadow-cta ${isValid ? '' : 'opacity-40'
                }`}
            >
              <Text className="font-sans-bold text-base text-surface">Continue</Text>
              <Image source={arrowIcon} accessible={false} className="h-5 w-5 text-surface" />
            </Pressable>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              accessibilityRole="button"
              hitSlop={8}
              className="min-h-11 justify-center self-center"
            >
              <Text className="font-sans text-caption text-muted">
                Already have an account? <Text className="font-sans-bold text-accent">Sign in</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}