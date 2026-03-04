const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroceryItem = {
  name: string;
  quantity: string;
  unit: string;
};

export async function parseGroceryList(rawText: string): Promise<GroceryItem[]> {
    console.log("Groq key loaded:", !!process.env.EXPO_PUBLIC_GROQ_API_KEY);
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a grocery list parser. Extract grocery items from raw OCR text and return ONLY a JSON array with no explanation or markdown. Each item should have:
            - name: the item name, cleaned up and normalized (e.g. "milk" not "mlk" or "2% Milk")
            - quantity: the number as a string (e.g. "2"), or "1" if not specified
            - unit: the unit if mentioned (e.g. "kg", "L", "bag"), or "" if not specified`,
        },
        {
          role: "user",
          content: `Parse this grocery list into JSON:\n\n${rawText}`,
        },
      ],
      temperature: 0.1, // low temperature for consistent structured output
    }),
  });

if (!response.ok) {
  const errorBody = await response.text();
  console.error("Groq error status:", response.status);
  console.error("Groq error body:", errorBody);
  throw new Error(`Groq API error: ${response.status} - ${errorBody}`);
}

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error("No response from Groq");

  // Strip markdown code fences if model includes them
  const cleaned = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as GroceryItem[];
}