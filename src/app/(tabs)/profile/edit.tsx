import { useProfile } from '@/lib/profile';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});

const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const editIcon = require('@/assets/svg/icons/ic-edit.svg');
const userIcon = require('@/assets/svg/icons/ic-user.svg');
const shieldIcon = require('@/assets/svg/icons/ic-shield.svg');
const mailIcon = require('@/assets/svg/icons/ic-mail.svg');

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [photo, setPhoto] = useState(profile.photo);

  const isValid = name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(email.trim());

  const onPickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const onSave = () => {
    if (!isValid) return;
    // TODO: send the changes (and the new photo upload) to your API before updating the screen state
    updateProfile({ name: name.trim(), email: email.trim(), photo });
    router.back();
  };

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
          <Text className="font-sans-bold text-h2 text-ink">Edit profile</Text>
          <View className="h-11 w-11" />
        </View>

        <Pressable
          onPress={onPickPhoto}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          className="my-1.5 h-24 w-24 self-center"
        >
          {photo ? (
            <Image source={{ uri: photo }} accessible={false} className="h-24 w-24 rounded-full" />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-accent-tint">
              <Text className="font-sans-bold text-h1 text-ink">{name.charAt(0).toUpperCase() || '?'}</Text>
            </View>
          )}
          <View className="absolute -bottom-1 -right-2 h-11 w-11 items-center justify-center rounded-full bg-surface shadow-soft">
            <Image source={editIcon} accessible={false} className="h-5 w-5 text-accent" />
          </View>
        </Pressable>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={userIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Full name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderClassName="text-muted"
              autoCapitalize="words"
              textContentType="name"
              accessibilityLabel="Full name"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
        </View>

        {/* The phone number is read only: changing it needs a new verification code (TODO: add that flow) */}
        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 py-3 shadow-soft">
          <Image source={shieldIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Phone number (verified)</Text>
            <Text className="font-sans-bold text-base text-ink">{profile.phone}</Text>
          </View>
        </View>

        <View className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft">
          <Image source={mailIcon} accessible={false} className="h-[22px] w-[22px] text-accent" />
          <View className="flex-1">
            <Text className="font-sans text-caption text-muted">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderClassName="text-muted"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              accessibilityLabel="Email"
              className="py-0.5 font-sans-bold text-base text-ink"
            />
          </View>
        </View>

        <Pressable
          onPress={onSave}
          disabled={!isValid}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${isValid ? '' : 'opacity-40'}`}
        >
          <Text className="font-sans-bold text-base text-surface">Save changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}