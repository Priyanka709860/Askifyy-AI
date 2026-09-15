export async function callGeminiAPI(prompt) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data.text;
  } catch (error) {
    console.error("Frontend Gemini API Error:", error);
    return "Error fetching response from Gemini API.";
  }
}
