import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

export async function extractHandwritingFromImage(photoUri: string): Promise<string> {
  // Resize and compress before sending
  const manipulated = await ImageManipulator.manipulateAsync(
    photoUri,
    [{ resize: { width: 1500 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
    encoding: "base64",
  });

  const body = new FormData();
  body.append("base64Image", `data:image/jpeg;base64,${base64}`);
  body.append("apikey", process.env.EXPO_PUBLIC_OCRSPACE_API_KEY!);
  body.append("language", "eng");
  body.append("isOverlayRequired", "false");
  body.append("OCREngine", "2");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(`OCR.space error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.IsErroredOnProcessing) {
    throw new Error(`OCR.space: ${data.ErrorMessage}`);
  }

  const text = data.ParsedResults?.[0]?.ParsedText;
  if (!text) throw new Error("No text detected in image.");
  return text;
}