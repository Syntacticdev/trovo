import { useProfile, type AddressLabel } from '@/lib/profile';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });
cssInterop(SafeAreaView, { className: 'style' });
cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});


const arrowIcon = require('@/assets/svg/icons/ic-arrow.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');
const editIcon = require('@/assets/svg/icons/ic-edit.svg');

const labels: AddressLabel[] = ['Home', 'Office', 'Other'];

// This screen adds an address when the URL is /profile/addresses/new, and edits one otherwise
export default function EditAddressScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addresses, saveAddress, removeAddress } = useProfile();

  const isNew = id === 'new';
  const existing = addresses.find((a) => a.id === id);

  const [label, setLabel] = useState<AddressLabel>(existing?.label ?? 'Home');
  const [street, setStreet] = useState(existing?.street ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [note, setNote] = useState(existing?.note ?? '');

  // an address that does not exist (old link, or it was just deleted)
  if (!isNew && !existing) return <Redirect href="/profile/addresses" />;

  const isValid = street.trim().length > 0 && city.trim().length > 0;

  const onSave = () => {
    if (!isValid) return;
    // TODO: save to your API first, then update the screen state
    saveAddress({ id: existing?.id, label, street: street.trim(), city: city.trim(), note: note.trim() });
    router.back();
  };

  const onDelete = () => {
    Alert.alert('Delete address', 'This address will be removed from your saved places.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // TODO: delete on your API first
          if (existing) removeAddress(existing.id);
          router.back();
        },
      },
    ]);
  };

  const fields = [
    { key: 'street', label: 'Street', value: street, onChange: setStreet, icon: pinIcon, placeholder: '44 Adeola Odeku' },
    { key: 'city', label: 'City', value: city, onChange: setCity, icon: pinIcon, placeholder: 'Lagos' },
    { key: 'note', label: 'Delivery note', value: note, onChange: setNote, icon: editIcon, placeholder: 'Ask for reception' },
  ];

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
          <Text className="font-sans-bold text-h2 text-ink">{isNew ? 'Add address' : 'Edit address'}</Text>
          <View className="h-11 w-11" />
        </View>

        <Text className="font-sans-bold text-base text-ink">Label</Text>
        <View className="flex-row gap-3">
          {labels.map((name) => {
            const selected = label === name;
            return (
              <Pressable
                key={name}
                onPress={() => setLabel(name)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                className={`min-h-11 flex-1 items-center justify-center rounded-pill py-3 ${selected ? 'bg-ink' : 'bg-surface'
                  }`}
              >
                <Text className={`font-sans-bold text-caption ${selected ? 'text-surface' : 'text-ink'}`}>{name}</Text>
              </Pressable>
            );
          })}
        </View>

        {fields.map((field) => (
          <View
            key={field.key}
            className="min-h-14 flex-row items-center gap-3 rounded-field bg-surface px-4 shadow-soft"
          >
            <Image source={field.icon} accessible={false} className="h-[22px] w-[22px] text-accent" />
            <View className="flex-1">
              <Text className="font-sans text-caption text-muted">{field.label}</Text>
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={field.placeholder}
                placeholderClassName="text-muted"
                accessibilityLabel={field.label}
                className="py-0.5 font-sans-bold text-base text-ink"
              />
            </View>
          </View>
        ))}

        <Pressable
          onPress={onSave}
          disabled={!isValid}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${isValid ? '' : 'opacity-40'}`}
        >
          <Text className="font-sans-bold text-base text-surface">Save address</Text>
        </Pressable>

        {!isNew && (
          <Pressable onPress={onDelete} accessibilityRole="button" className="min-h-11 items-center justify-center">
            <Text className="font-sans-bold text-caption text-danger">Delete address</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}