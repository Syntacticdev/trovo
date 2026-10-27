import { Image } from 'expo-image';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { cssInterop } from 'nativewind';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Lets className work on Image. A text color class (text-surface, text-muted)
// becomes the icon tintColor.
cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });

// Props of the custom tab bar, taken from the Tabs component itself so no
// extra @react-navigation package import is needed.
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

// Imported assets (SVG files you drop into assets/svg/icons)
const icons: Record<string, number> = {
  index: require('@/assets/svg/icons/ic-home.svg'),
  ship: require('@/assets/svg/icons/ic-box.svg'),
  shipments: require('@/assets/svg/icons/ic-clock.svg'),
  profile: require('@/assets/svg/icons/ic-user.svg'),
};

// Where each tab goes when pressed (route name -> path)
const hrefs: Record<string, string> = {
  index: '/',
  ship: '/ship',
  shipments: '/shipments',
  profile: '/profile',
};

// Floating dock. It sits in the layout (not on top of it), so screen content
// is never hidden behind it.
function TabBar({ state, descriptors }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments() as string[];

  // Hide the dock on inner screens (package details, Live tracking, edit
  // profile ...). It only shows on the root screen of each tab.
  // ['(tabs)', 'ship'] is a tab root, ['(tabs)', 'ship', 'address'] is not.
  const depth = segments.filter((segment) => segment !== '(tabs)' && segment !== 'index').length;
  if (depth > 1) return null;

  return (
    <View className="bg-canvas px-4 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <View className="h-[78px] flex-row items-center justify-around rounded-pill bg-surface shadow-soft">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const title = descriptors[route.key].options.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              onPress={() => !isFocused && router.navigate(hrefs[route.name] as never)}
              accessibilityRole="tab"
              accessibilityLabel={title}
              accessibilityState={{ selected: isFocused }}
              className={`min-h-14 min-w-11 flex-row items-center justify-center gap-1.5 rounded-pill py-3 ${isFocused ? 'bg-accent px-[18px]' : 'px-3'
                }`}
            >
              <Image
                source={icons[route.name]}
                accessible={false}
                className={`h-[22px] w-[22px] ${isFocused ? 'text-surface' : 'text-muted'}`}
              />
              {isFocused && <Text className="font-sans-bold text-caption text-surface">{title}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="ship" options={{ title: 'Ship' }} />
      <Tabs.Screen name="shipments" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}