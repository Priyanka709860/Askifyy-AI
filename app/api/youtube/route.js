import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.YOUTUBE_API_KEY;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    const videos = data.items?.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("YouTube API error:", err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
