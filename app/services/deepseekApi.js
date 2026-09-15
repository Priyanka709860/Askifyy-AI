export async function callDeepSeekAPI(prompt, model = "deepseek-chat") {
  try {
    const response = await fetch("/api/deepseek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model }),
    });

    const text = await response.text(); // always get text first
    let data;

    try {
      data = JSON.parse(text); // try parsing JSON
    } catch {
      console.error("DeepSeek returned non-JSON:", text);
      return "Error: DeepSeek API returned non-JSON response";
    }

    console.log("DeepSeek API raw response:", data);

    // ✅ safely access message content
    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    if (data?.error) {
      return `Error: ${data.error.message || JSON.stringify(data.error)}`;
    }

    return "No response from DeepSeek API";
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return "Error calling DeepSeek API";
  }
}
