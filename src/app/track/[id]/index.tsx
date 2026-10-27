import {
  fetchShipment,
  getShipment,
  type ShipmentStatus,
} from "@/lib/shipments";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

cssInterop(Image, {
  className: { target: "style", nativeStyleToProp: { color: "tintColor" } },
});

const mapIllustration = require("@/assets/svg/illustrations/ill-map-grid.svg");
const arrowIcon = require("@/assets/svg/icons/ic-arrow.svg");
const pinIcon = require("@/assets/svg/icons/ic-pin.svg");
const bikeIcon = require("@/assets/svg/icons/ic-bike.svg");
const checkIcon = require("@/assets/svg/icons/ic-check.svg");

// TODO: replace with the live courier position, ETA and phone number from your tracking API
const COURIER_PHONE = "+2348012345678";
const ETA = "4:20 pm";
const progressByStatus: Record<ShipmentStatus, number> = {
  "In transit": 0.5,
  "Out for delivery": 0.8,
  Delivered: 1,
};

// Route drawn on ill-map-grid.svg, as percentages of the map: start, middle, destination
const POLL_MS = 15000; // how often to ask the API for the shipment status

const START = { x: 19.4, y: 81 };
const MIDDLE = { x: 47, y: 47.6 };
const END = { x: 80.5, y: 16.7 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const courierPosition = (p: number) =>
  p < 0.5
    ? {
        x: lerp(START.x, MIDDLE.x, p / 0.5),
        y: lerp(START.y, MIDDLE.y, p / 0.5),
      }
    : {
        x: lerp(MIDDLE.x, END.x, (p - 0.5) / 0.5),
        y: lerp(MIDDLE.y, END.y, (p - 0.5) / 0.5),
      };

const pinClass =
  "absolute h-10 w-10 -translate-x-5 -translate-y-5 items-center justify-center rounded-full border-[3px] border-surface";

export default function LiveTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [shipment, setShipment] = useState(() => getShipment(id));

  // Ask for the latest status every few seconds. TODO: use a websocket or push update if your API has one.
  useEffect(() => {
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const latest = await fetchShipment(id);
        if (!cancelled && latest) setShipment(latest);
      } catch {
        // keep the last known status and try again on the next tick
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [id]);

  // The parcel arrived: this is how the delivered screen opens. replace, so Back does not return to the map.
  const delivered = shipment?.status === "Delivered";
  useEffect(() => {
    if (delivered && shipment)
      router.replace(`/track/${shipment.id}/delivered`);
  }, [delivered, shipment, router]);

  const backButton = (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      className="absolute left-5 h-11 w-11 items-center justify-center rounded-full bg-surface shadow-soft"
      style={{ top: insets.top + 8 }}
    >
      <Image
        source={arrowIcon}
        accessible={false}
        className="h-5 w-5 -scale-x-100 text-ink"
      />
    </Pressable>
  );

  if (!shipment) {
    return (
      <View className="flex-1 bg-canvas">
        {backButton}
        <Text className="mt-40 text-center font-sans text-body text-muted">
          We could not find this shipment.
        </Text>
      </View>
    );
  }

  // nothing to show while the effect above opens the delivered screen
  if (delivered) return null;

  const progress = progressByStatus[shipment.status];
  const courier = courierPosition(progress);
  const steps = [
    { label: "Booked", done: true },
    { label: "Collected", done: true },
    { label: shipment.status, done: true },
    { label: "Delivered", done: false },
  ];

  return (
    <View className="flex-1 bg-canvas">
      <View className="absolute inset-x-0 top-0 bottom-[38%]">
        <Image
          source={mapIllustration}
          contentFit="fill"
          accessibilityLabel="Map of the delivery route"
          className="absolute inset-0"
        />
        <View
          className={`${pinClass} bg-accent`}
          style={{ left: `${START.x}%`, top: `${START.y}%` }}
        >
          <Image
            source={pinIcon}
            accessible={false}
            className="h-5 w-5 text-surface"
          />
        </View>
        <View
          className={`${pinClass} bg-ink`}
          style={{ left: `${END.x}%`, top: `${END.y}%` }}
        >
          <Image
            source={checkIcon}
            accessible={false}
            className="h-5 w-5 text-surface"
          />
        </View>
        <View
          className={`${pinClass} bg-ink`}
          style={{ left: `${courier.x}%`, top: `${courier.y}%` }}
        >
          <Image
            source={bikeIcon}
            accessible={false}
            className="h-5 w-5 text-surface"
          />
        </View>
      </View>

      {backButton}

      <View
        className="absolute inset-x-0 bottom-0 gap-2 rounded-t-[32px] bg-surface px-5 pt-5 shadow-soft"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-sans text-caption text-muted">
              Arrives today
            </Text>
            <Text className="font-sans-bold text-h2 text-ink">{ETA}</Text>
          </View>
          <View className="rounded-pill bg-accent-tint px-3 py-1">
            <Text className="font-sans-bold text-caption text-ink">
              {shipment.status}
            </Text>
          </View>
        </View>

        <Text className="font-sans text-caption text-muted">{shipment.id}</Text>

        {steps.map((step) => (
          <View key={step.label} className="flex-row items-center gap-2.5">
            <View
              className={`h-5 w-5 items-center justify-center rounded-full ${
                step.done ? "bg-success" : "border-2 border-muted bg-surface"
              }`}
            >
              {step.done && (
                <Image
                  source={checkIcon}
                  accessible={false}
                  className="h-3 w-3 text-surface"
                />
              )}
            </View>
            <Text
              className={`font-sans text-body ${step.done ? "text-ink" : "text-muted"}`}
            >
              {step.label}
            </Text>
          </View>
        ))}

        <Pressable
          onPress={() => Linking.openURL(`tel:${COURIER_PHONE}`)}
          accessibilityRole="button"
          className="mt-3 h-14 items-center justify-center rounded-pill bg-accent shadow-cta"
        >
          <Text className="font-sans-bold text-base text-surface">
            Contact courier
          </Text>
        </Pressable>

        {/* development only: opens the delivered screen without waiting for the API */}
        {__DEV__ && (
          <Pressable
            onPress={() => router.replace(`/track/${shipment.id}/delivered`)}
            accessibilityRole="button"
            className="min-h-11 items-center justify-center"
          >
            <Text className="font-sans-bold text-caption text-accent">
              Simulate delivery (dev only)
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
