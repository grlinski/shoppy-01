import { useRef, useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
const cameraRef = useRef<any>(null);
  const router = useRouter();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Button title="Allow Camera Access" onPress={requestPermission} />
      </View>
    );
  }

const takePicture = async () => {
  if (cameraRef.current) {
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        Alert.alert("Photo Taken!", photo.uri);
      }
    } catch (err) {
      console.error("Failed to take photo:", err);
      Alert.alert("Error", "Could not take photo. Check console for details.");
    }
  }
};

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={type}
        ref={cameraRef}
      />

      <View style={styles.controls}>
        <Button
          title="Flip"
          onPress={() =>
            setType(type === "back" ? "front" : "back")
          }
        />
        <Button title="Snap" onPress={takePicture} />
        <Button title="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});