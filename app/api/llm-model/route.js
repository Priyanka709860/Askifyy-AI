import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or missing JSON body" },
        { status: 400 }
      );
    }

    const { searchInput, searchResult, recordId } = body || {};

    if (!searchInput || !recordId) {
      return NextResponse.json(
        { error: "searchInput and recordId are required" },
        { status: 400 }
      );
    }

    console.log("Incoming request:", { searchInput, recordId });

    const inngestRunResp = await inngest.send({
      name: "llm-model",
      data: {
        searchInput,
        searchResult,
        recordId,
      },
    });

    const runId = inngestRunResp?.ids?.[0] ?? null;

    return NextResponse.json({ runId });
  } catch (error) {
    console.error("Error in llm-model route:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
