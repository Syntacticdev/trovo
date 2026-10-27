import { Pressable, Text } from "react-native";

import { tokens } from "@/constants/tokens";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function Button({ title, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: tokens.radius.pill,
        backgroundColor: disabled ? tokens.color.border : tokens.color.accent,
      }}
    >
      <Text
        style={{
          color: tokens.color.accentContrast,
          fontSize: tokens.font.body,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
