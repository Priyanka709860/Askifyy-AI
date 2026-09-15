export async function fetchAnswer(searchInput) {
  // 1. Call Google API
  const googleRes = await fetch("/api/google-api", {
    method: "POST",
    body: JSON.stringify({ searchInput, searchType: "text" }),
  });
  const googleData = await googleRes.json();

  // 2. Call Gemini API with Google results
  const geminiRes = await fetch("/api/gemini-api", {
    method: "POST",
    body: JSON.stringify({ items: googleData.items }),
  });
  const finalData = await geminiRes.json();

  // 👉 Only Gemini summary return pannuvom
  return { aiResp: finalData.aiResp };
}
