import { inngest } from "./client";
import { supabase } from "@/services/supabase";

export const llmModel = inngest.createFunction(
  { name: 'llm-model' },
  { event: 'llm-model' },
  async ({ event, step }) => {
    const userInput = event.data.searchInput;
    const searchResults = Array.isArray(event.data.searchResult) ? event.data.searchResult : [];

    // Construct AI prompt
    const aiPrompt = [
      {
        role: 'user',
        parts: [
          {
            text: `You are a helpful assistant. Here is the user input topic: "${userInput}". ${
              searchResults.length > 0
                ? `Please summarize and provide markdown-formatted output based on the following search results:\n\n${searchResults
                    .map((item, i) => `# ${item.title}\n\n${item.description}\n\nURL: ${item.url}\n\n---\n`)
                    .join('\n')}`
                : "There are no search results. Respond helpfully and provide an informative answer based solely on the user input."
            }`
          }
        ]
      }
    ];

    // Call AI model
    const aiResp = await step.ai.infer('generate-ai-llm-model-call', {
      model: step.ai.models.gemini({
        model: 'gemini-2.5-flash',
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
      }),
      body: {
        contents: aiPrompt
      }
    });

    const aiText = aiResp?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";

    // Save AI response to Supabase
    await step.run('saveToDb', async () => {
      const { data, error } = await supabase
        .from('Chats')
        .update({ aiResp: aiText })
        .eq('id', event.data.recordId)
        .select();

      if (error) console.error("Supabase update error:", error);
      return data;
    });

    return { success: true };
  }
);
