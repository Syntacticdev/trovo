import { useSession } from '@/lib/session';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });

cssInterop(ActivityIndicator, { className: { target: 'style', nativeStyleToProp: { color: 'color' } } });


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const shieldIcon = require('@/assets/svg/icons/ic-shield.svg');

const CODE_LENGTH = 4;
const RESEND_SECONDS = 24;

// TODO: replace with your API call. Throw when the code is wrong.
async function verifyCode(_phone: string, code: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (code.length !== CODE_LENGTH) throw new Error('Invalid code');
}

// TODO: replace with your API call that sends a new code.
async function requestCode(_phone: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function VerifyScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const { phone = '' } = useLocalSearchParams<{ phone?: string }>();
  const inputRef = useRef<TextInputInstance>(null);

  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const isComplete = code.length === CODE_LENGTH;
  const isLoading = status === 'loading';
  const ctaDisabled = !isComplete || isLoading;

  // resend countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const onChangeCode = (text: string) => {
    setCode(text.replace(/\D/g, '').slice(0, CODE_LENGTH));
    if (status === 'error') setStatus('idle');
  };

  const onVerify = async () => {
    if (ctaDisabled) return;
    setStatus('loading');
    try {
      await verifyCode(phone, code);
      signIn();
      router.replace('/'); // replace so Back never returns to the auth stack
    } catch {
      setStatus('error');
    }
  };

  const onResend = async () => {
    if (secondsLeft > 0) return;
    setCode('');
    setStatus('idle');
    setSecondsLeft(RESEND_SECONDS);
    await requestCode(phone);
    inputRef.current?.focus();
  };

  const boxBorder = (i: number) =>
    status === 'error' ? 'border-danger' : i === code.length ? 'border-accent' : 'border-transparent';

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 gap-3.5 px-6 pt-2">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            >
              <Image source={arrowIcon} accessible={false} className="h-5 w-5 -scale-x-100" />
            </Pressable>
            <Text className="font-sans-bold text-h2 text-ink">Verify number</Text>
            <View className="h-11 w-11" />
          </View>

          <Image
            source={shieldIcon}
            accessible={false}
            className="mt-[30px] h-12 w-12 self-center text-accent"
          />

          <Text className="text-center font-sans-bold text-h1 text-ink">Enter the Code</Text>
          <Text className="text-center font-sans text-body text-muted">
            We sent a {CODE_LENGTH}-digit code to {phone || 'your phone'}
          </Text>

          {/* Boxes are display only. One hidden input receives the typing and the SMS autofill. */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="mt-1.5 flex-row justify-center gap-3"
          >
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              <View
                key={i}
                className={`h-16 w-14 items-center justify-center rounded-field border-2 bg-surface ${boxBorder(i)}`}
              >
                <Text className="font-sans-bold text-2xl text-ink">{code[i] ?? ''}</Text>
              </View>
            ))}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={onChangeCode}
              autoFocus
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              maxLength={CODE_LENGTH}
              caretHidden
              accessibilityLabel="Verification code"
              className="absolute h-px w-px opacity-0"
            />
          </Pressable>

          {status === 'error' && (
            <Text accessibilityRole="alert" className="text-center font-sans text-caption text-danger">
              That code did not work. Check it and try again.
            </Text>
          )}

          {secondsLeft > 0 ? (
            <Text className="text-center font-sans text-caption text-muted">
              Resend code in {formatTime(secondsLeft)}
            </Text>
          ) : (
            <Pressable
              onPress={onResend}
              accessibilityRole="button"
              className="min-h-11 justify-center self-center"
            >
              <Text className="font-sans-bold text-caption text-accent">Resend code</Text>
            </Pressable>
          )}

          <Pressable
            onPress={onVerify}
            disabled={ctaDisabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: ctaDisabled, busy: isLoading }}
            className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${ctaDisabled ? 'opacity-40' : ''
              }`}
          >
            {isLoading ? (
              <ActivityIndicator className="text-surface" />
            ) : (
              <Text className="font-sans-bold text-base text-surface">Verify</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}