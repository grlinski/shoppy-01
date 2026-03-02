import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CameraButtonProps {
  onPress: () => void;
  size?: number;
}

export default function CameraButton({ onPress, size = 110 }: CameraButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            width: size * 0.75,
            height: size * 0.75,
            borderRadius: (size * 0.75) / 2,
          },
        ]}
      >
        <Ionicons
          name="camera"
          size={size * 0.4}
          color="white"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  inner: {
    backgroundColor: "#2e86de",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});