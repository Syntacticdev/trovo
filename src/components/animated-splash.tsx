import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';


cssInterop(Image, { className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } } });


const logoMark = require('@/assets/svg/brand/logo-mark.svg');
const pinIcon = require('@/assets/svg/icons/ic-pin.svg');

const TRAIL_WIDTH = 168; // length of the dotted route under the logo
const DOT_COUNT = 8;
const SPLASH_DURATION = 2300; // ms until onFinish is called

type Props = {
    onReady?: () => void;
    onFinish: () => void;
};

/*
  Animation timeline (ms):
    150   the logo pops, and a ring ripples out from it
    500   a courier dot travels along the dotted route
    900   the "Trovo" wordmark rises in
    1150  the destination pin pops in at the end of the route
    1250  the tagline fades in
    2000  everything fades out, revealing the app (done at 2300)
*/
export default function AnimatedSplash({ onReady, onFinish }: Props) {
    const scale = useSharedValue(1);
    const ring = useSharedValue(0);
    const trail = useSharedValue(0);
    const pin = useSharedValue(0);
    const word = useSharedValue(0);
    const tagline = useSharedValue(0);
    const exit = useSharedValue(1);

    // run the animation once, when the splash first appears
    useEffect(() => {
        scale.value = withDelay(
            150,
            withSequence(
                withTiming(1.14, { duration: 220, easing: Easing.out(Easing.cubic) }),
                withSpring(1, { damping: 9, stiffness: 160 }),
            ),
        );
        ring.value = withDelay(250, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
        trail.value = withDelay(500, withTiming(1, { duration: 700, easing: Easing.inOut(Easing.cubic) }));
        word.value = withDelay(900, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }));
        pin.value = withDelay(1150, withSpring(1, { damping: 8, stiffness: 180 }));
        tagline.value = withDelay(1250, withTiming(1, { duration: 450 }));
        exit.value = withDelay(2000, withTiming(0, { duration: 300 }));

        const timer = setTimeout(onFinish, SPLASH_DURATION);
        return () => clearTimeout(timer);
    }, []);

    const containerStyle = useAnimatedStyle(() => ({ opacity: exit.value }));
    const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    const ringStyle = useAnimatedStyle(() => ({
        opacity: interpolate(ring.value, [0, 1], [0.6, 0]),
        transform: [{ scale: interpolate(ring.value, [0, 1], [1, 2.4]) }],
    }));
    const trailStyle = useAnimatedStyle(() => ({
        opacity: interpolate(trail.value, [0, 0.15], [0, 1], Extrapolation.CLAMP),
    }));
    const courierStyle = useAnimatedStyle(() => ({
        opacity: interpolate(trail.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
        transform: [{ translateX: trail.value * (TRAIL_WIDTH - 12) }],
    }));
    const pinStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pin.value, [0, 0.3], [0, 1], Extrapolation.CLAMP),
        transform: [{ scale: pin.value }, { translateY: interpolate(pin.value, [0, 1], [6, 0]) }],
    }));
    const wordStyle = useAnimatedStyle(() => ({
        opacity: word.value,
        transform: [{ translateY: interpolate(word.value, [0, 1], [14, 0]) }],
    }));
    const taglineStyle = useAnimatedStyle(() => ({ opacity: tagline.value }));

    return (
        <Animated.View
            onLayout={onReady}
            accessibilityLabel="Trovo"
            className="absolute inset-0 bg-accent"
            style={containerStyle}
        >
            {/* the logo, centered exactly like the native splash screen */}
            <View className="flex-1 items-center justify-center">
                <View className="h-24 w-24">
                    <Animated.View
                        style={ringStyle}
                        className="absolute inset-0 rounded-full border-2 border-surface"
                    />
                    <Animated.View style={logoStyle}>
                        <Image source={logoMark} contentFit="contain" accessible={false} className="h-24 w-24" />
                    </Animated.View>
                </View>
            </View>

            {/* everything else sits below the logo, so the logo never moves */}
            <View className="absolute inset-x-0 items-center gap-3.5" style={{ top: '50%', marginTop: 72 }}>
                <View className="flex-row items-center gap-2">
                    <Animated.View
                        style={[trailStyle, { width: TRAIL_WIDTH }]}
                        className="h-3 flex-row items-center justify-between"
                    >
                        {Array.from({ length: DOT_COUNT }).map((_, i) => (
                            <View key={i} className="h-1.5 w-1.5 rounded-full bg-surface opacity-40" />
                        ))}
                        <Animated.View style={courierStyle} className="absolute left-0 h-3 w-3 rounded-full bg-surface" />
                    </Animated.View>
                    <Animated.View style={pinStyle}>
                        <Image source={pinIcon} accessible={false} className="h-6 w-6 text-surface" />
                    </Animated.View>
                </View>

                <Animated.View style={wordStyle}>
                    <Text className="font-sans-bold text-h1 text-surface">Trovo</Text>
                </Animated.View>
                <Animated.View style={taglineStyle}>
                    <Text className="font-sans text-body text-surface">Ship anything, anywhere</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
}