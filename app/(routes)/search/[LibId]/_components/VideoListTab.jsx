"use client";
import React, { useEffect, useState } from "react";

function VideoListTab({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ YouTube fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  if (loading) return <p className="text-gray-500 mt-2">Loading videos...</p>;
  if (!videos.length) return <p className="text-gray-500 mt-2">No videos found</p>;

  return (
    <div className="flex gap-5 flex-wrap mt-6">
      {videos.map((video) => (
        <a
          href={video.url}
          key={video.id}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-[200px] cursor-pointer"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-[120px] object-cover rounded-xl group-hover:brightness-90 transition"
          />
          <h3 className="mt-2 text-sm font-medium line-clamp-2">{video.title}</h3>
        </a>
      ))}
    </div>
  );
}

export default VideoListTab;
