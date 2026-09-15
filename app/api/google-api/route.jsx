import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { searchInput, searchType } = await req.json();

    if (!searchInput) {
      return NextResponse.json(
        { error: "Please pass user search query" },
        { status: 400 }
      );
    }

    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing TAVILY_API_KEY" },
        { status: 500 }
      );
    }

    console.log("🔍 Search Query:", searchInput);
    console.log("🔑 Tavily API Key exists:", !!apiKey);

    const result = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: apiKey,
        query: searchInput,
        search_depth: "advanced",
        max_results: 5,
        include_answer: true,
        include_images: searchType === "image",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Tavily API Success");

    const tavilyData = result.data;

    // Tavily results → existing DisplayResult format
    const items = (tavilyData?.results || []).map((item) => ({
      title: item?.title || "",
      snippet: item?.content || "",
      link: item?.url || "",
      pagemap: {
        metatags: [
          {
            "og:site_name": null,
          },
        ],
        cse_image: [],
        cse_thumbnail: [],
      },
    }));

    console.log("✅ Converted items:", items);

    return NextResponse.json({
      ...tavilyData,
      items,
    });
  } catch (error) {
    console.error("❌ FULL TAVILY API ERROR:", error);
    console.error(
      "❌ RESPONSE DATA:",
      error?.response?.data
    );
    console.error(
      "❌ STATUS:",
      error?.response?.status
    );
    console.error(
      "❌ MESSAGE:",
      error?.message
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Tavily API request failed",
        details:
          error?.response?.data || null,
      },
      {
        status:
          error?.response?.status || 500,
      }
    );
  }
}