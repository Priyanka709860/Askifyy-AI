import React, { useState } from "react";
import DisplaySummery from "./DisplaySummery";
import { Copy, Download, ThumbsUp, ThumbsDown } from "lucide-react";

function AnswerDisplay({ chat }) {
  const [liked, setLiked] = useState(null);

  // ✅ Copy Answer
  const handleCopy = () => {
    if (chat?.aiResp) {
      navigator.clipboard.writeText(chat.aiResp);
      alert("✅ Copied to clipboard!");
    }
  };

  // ✅ Download Answer
  const handleDownload = () => {
    if (chat?.aiResp) {
      const blob = new Blob([chat.aiResp], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "answer.txt";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-5">
      {/* ✅ Answer Summary */}
      <DisplaySummery aiResp={chat?.aiResp} />

      {/* ✅ Action Buttons */}
      <div className="flex gap-6 text-gray-600 mt-2">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-black"
        >
          <Copy size={18} /> Copy
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 hover:text-black"
        >
          <Download size={18} /> Download
        </button>

        {/* Like */}
        <button
          onClick={() => setLiked(true)}
          className={`flex items-center gap-1 ${
            liked === true ? "text-green-600" : "hover:text-black"
          }`}
        >
          <ThumbsUp size={18} /> Like
        </button>

        {/* Dislike */}
        <button
          onClick={() => setLiked(false)}
          className={`flex items-center gap-1 ${
            liked === false ? "text-red-600" : "hover:text-black"
          }`}
        >
          <ThumbsDown size={18} /> Dislike
        </button>
      </div>
    </div>
  );
}

export default AnswerDisplay;