import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        {
          error: "Prompt is required",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is missing in .env.local",
        },
        {
          status: 500,
        }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const output = response?.text || "";

    if (!output) {
      return NextResponse.json(
        {
          error: "Gemini returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      output: output,
    });
  } catch (error) {
    console.error("GEMINI API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Gemini API request failed",
      },
      {
        status: 500,
      }
    );
  }
}