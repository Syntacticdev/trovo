import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(Image, {
  className: { target: "style", nativeStyleToProp: { color: "tintColor" } },
});
cssInterop(SafeAreaView, { className: "style" });
cssInterop(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: "color" } },
});

const successIllustration = require("@/assets/svg/illustrations/ill-success.svg");
const starIcon = require("@/assets/svg/icons/ic-star.svg");
const starFilledIcon = require("@/assets/svg/icons/ic-star-filled.svg");

const STARS = [1, 2, 3, 4, 5];

// TODO: replace with the delivery details (recipient name, time, where it was left) from your API
const delivery = {
  receivedBy: "Ada O.",
  time: "4:12 pm",
  leftWith: "Recipient",
};

// TODO: replace with your API call that saves the courier rating
async function submitRating(_shipmentId: string, _rating: number) {
  await new Promise((resolve) => setTimeout(resolve, 600));
}

export default function DeliveredScreen() {
  const router = useRouter();
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const isLoading = status === "loading";
  const canSubmit = rating > 0 && !isLoading;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setStatus("loading");
    try {
      await submitRating(id, rating);
      router.replace("/");
    } catch {
      setStatus("error");
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-canvas">
      <ScrollView
        contentContainerClassName="grow gap-3.5 px-5 pb-6 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={successIllustration}
          contentFit="contain"
          accessibilityLabel="Delivery completed"
          className="mb-1 mt-6 h-[130px] w-[130px] self-center"
        />

        <Text className="text-center font-sans-bold text-h1 text-ink">
          Parcel Delivered
        </Text>
        <Text className="text-center font-sans text-body text-muted">
          Received by {delivery.receivedBy} today at {delivery.time}.
        </Text>

        <View className="gap-2 rounded-card bg-surface p-4 shadow-soft">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">Tracking ID</Text>
            <Text className="font-sans-bold text-body text-ink">{id}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-muted">Left with</Text>
            <Text className="font-sans-bold text-body text-ink">
              {delivery.leftWith}
            </Text>
          </View>
        </View>

        <Text className="mt-1 text-center font-sans-bold text-base text-ink">
          Rate your courier
        </Text>
        <View className="flex-row justify-center gap-1">
          {STARS.map((star) => {
            const filled = star <= rating;
            return (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                accessibilityRole="button"
                accessibilityLabel={`${star} ${star === 1 ? "star" : "stars"}`}
                accessibilityState={{ selected: filled }}
                className="h-11 w-11 items-center justify-center"
              >
                <Image
                  source={filled ? starFilledIcon : starIcon}
                  accessible={false}
                  className={`h-[34px] w-[34px] ${filled ? "text-accent" : "text-muted"}`}
                />
              </Pressable>
            );
          })}
        </View>

        {status === "error" && (
          <Text
            accessibilityRole="alert"
            className="text-center font-sans text-caption text-danger"
          >
            We could not save your rating. Try again.
          </Text>
        )}

        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit, busy: isLoading }}
          className={`h-14 items-center justify-center rounded-pill bg-accent shadow-cta ${
            canSubmit ? "" : "opacity-40"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator className="text-surface" />
          ) : (
            <Text className="font-sans-bold text-base text-surface">
              Submit rating
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          accessibilityRole="button"
          className="min-h-11 items-center justify-center"
        >
          <Text className="font-sans-bold text-caption text-accent">
            Not now
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
