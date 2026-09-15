import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing" },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are Askify AI. Give helpful, accurate and easy-to-understand answers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 2048,
    });

    const output =
      completion.choices?.[0]?.message?.content ||
      "No response generated.";

    return NextResponse.json({
      output,
    });
  } catch (error) {
    console.error("GROQ API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.error?.message ||
          error?.message ||
          "Groq API request failed",
      },
      {
        status: error?.status || 500,
      }
    );
  }
}