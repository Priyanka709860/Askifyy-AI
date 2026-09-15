import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { runId } = await req.json();

  try {
    const result = await axios.get(
      process.env.INNGEST_SERVER_HOST + "/v1/events/" + runId + "/runs",
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
        }
      }
    );

    // ✅ FIXED: wrap the result in NextResponse.json
    return NextResponse.json(result.data);

  } catch (e) {
    // Optional: return error message instead of whole error object
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
