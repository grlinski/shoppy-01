import { Text, View } from "react-native";
import Banner from "./components/banner";
import CameraButton from "./components/camerabutton";
import { useRouter } from "expo-router";



export default function Index() {
  const handleCameraPress = () => {
    console.log("Camera button pressed");
    // later we'll launch camera here
  };
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 60,
        backgroundColor: "#f2f2f2",
      }}
    >
      <Text>Shoppy</Text>
      <Banner 
        title="Welcome to Shoppy"
        description="Your favorite shopping app"
      />
<View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 60 }}>
      <CameraButton
        size={120}
        onPress={() => router.push("/components/camerascreen")}
      />
    </View>
    </View>
  );
}
