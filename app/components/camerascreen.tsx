import { useRef, useState } from "react";
import { useEntries } from "../../context/EntriesContext";



import {
  View,
  StyleSheet,
  Button,
  Alert,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { extractHandwritingFromImage } from "../../utils/ocr";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const { addEntry } = useEntries();

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
          addEntry(text);
          setExtractedText(text);
          setModalVisible(true);
        }
      } catch (err) {
        console.error("Failed:", err);
        Alert.alert("Error", "Could not extract text.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setModalVisible(false);
    setExtractedText(null);
  };

  const handleViewAll = () => {
    setModalVisible(false);
    router.push("./results"); // adjust path to match your results screen route
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={type}
        ref={cameraRef}
      />

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Extracting text...</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Button title="Flip" onPress={() => setType(type === "back" ? "front" : "back")} />
        <Button title="Snap" onPress={takePicture} />
        <Button title="Close" onPress={() => router.back()} />
      </View>

      {/* Result modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleRetry}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Extracted Text</Text>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{extractedText}</Text>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.buttonSecondary} onPress={handleRetry}>
                <Text style={styles.buttonSecondaryText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPrimary} onPress={handleViewAll}>
                <Text style={styles.buttonPrimaryText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 120,
    backgroundColor: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111",
  },
  modalScroll: {
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
});