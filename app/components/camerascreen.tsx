import { useRef, useState } from "react";
import { View, StyleSheet, Button, Alert, Text, ScrollView, ActivityIndicator } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { extractHandwritingFromImage } from "../../utils/ocr";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
        if (photo?.uri) {
          setExtractedText(null);
          setLoading(true);
          const text = await extractHandwritingFromImage(photo.uri);
          setExtractedText(text);
        }
      } catch (err) {
        console.error("Failed:", err);
        Alert.alert("Error", "Could not extract text.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera takes up top half */}
      <CameraView
        style={styles.camera}
        facing={type}
        ref={cameraRef}
      />

      <View style={styles.controls}>
        <Button title="Flip" onPress={() => setType(type === "back" ? "front" : "back")} />
        <Button title="Snap" onPress={takePicture} />
        <Button title="Close" onPress={() => router.back()} />
      </View>

      {/* Results area */}
      <View style={styles.results}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : extractedText ? (
          <ScrollView>
            <Text style={styles.resultText}>{extractedText}</Text>
          </ScrollView>
        ) : (
          <Text style={styles.placeholder}>Recognized text will appear here</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#000",
  },
  results: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#111",
  },
  placeholder: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 16,
  },
});