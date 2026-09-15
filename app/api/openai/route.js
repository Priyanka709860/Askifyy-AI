import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { prompt } = await req.json();

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  return new Response(
    JSON.stringify({ output: response.output[0].content[0].text }),
    { headers: { "Content-Type": "application/json" } }
  );
}
