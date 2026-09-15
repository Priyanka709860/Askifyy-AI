"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  ArrowRight,
  Atom,
  AudioLines,
  Cpu,
  Globe,
  Mic,
  Paperclip,
  SearchCheck,
  Calculator,
  FileText,
  PenTool,
  BookOpen,
  BookText,
  Code,
  Image,
  Edit3,
  Sparkles,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AIModelsOption } from "@/services/shared";
import { supabase } from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import axios from "axios";
import NewsCard from "../(routes)/discover/_components/NewsCard";

// AI Tool descriptions
const aiToolDescriptions = {
  "Math AI":
    "Solves complex mathematical problems, equations, and provides step-by-step solutions with explanations.",

  "AI Text Generator":
    "Creates engaging and coherent text content for various purposes and contexts.",

  "AI Poem Generator":
    "Crafts beautiful poems in different styles, themes, and poetic forms.",

  Storyteller:
    "Weaves captivating short stories with compelling narratives and characters.",

  Novelist:
    "Develops detailed, chapter-style stories with rich plot development and character arcs.",

  "AI Code":
    "Generates working code snippets, debugs, and explains programming concepts.",

  "Image Generator":
    "Creates detailed image descriptions and visual concepts for AI image generation.",

  "AI Writer":
    "Acts as a professional writer creating high-quality content across various genres.",
};

// AI Tool icons
const aiToolIcons = {
  "Math AI": Calculator,
  "AI Text Generator": FileText,
  "AI Poem Generator": PenTool,
  Storyteller: BookOpen,
  Novelist: BookText,
  "AI Code": Code,
  "Image Generator": Image,
  "AI Writer": Edit3,
};

function ChatInputBox() {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [searchType, setSearchType] = useState("search");

  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");

  const [selectedTool, setSelectedTool] = useState(null);
  const [showToolDescription, setShowToolDescription] = useState(false);

  const [topNews, setTopNews] = useState([]);

  const router = useRouter();

  const fileInputRef = useRef(null);

  // ==========================================
  // FILE
  // ==========================================

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      console.log("File selected:", file);
    }
  };

  // ==========================================
  // MICROPHONE
  // ==========================================

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setUserSearchInput(transcript);

      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  // ==========================================
  // GROQ API
  // ==========================================

  const callGroq = async (prompt) => {
    setLoading(true);

    try {
      const res = await fetch("/api/groq", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt,
        }),
      });

      const contentType =
        res.headers.get("content-type") || "";

      // Prevent Unexpected token '<' error
      if (!contentType.includes("application/json")) {
        const text = await res.text();

        console.error(
          "Non-JSON response from /api/groq:",
          text
        );

        throw new Error(
          `API returned non-JSON response. Status: ${res.status}`
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            "Groq API request failed"
        );
      }

      return (
        data?.output ||
        "No response from Groq."
      );
    } catch (err) {
      console.error(
        "Groq request failed:",
        err
      );

      return (
        err?.message ||
        "Error contacting Groq AI"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const onSearchQuery = async () => {
    if (!userSearchInput?.trim()) return;

    const libId = uuidv4();

    await supabase.from("Library").insert([
      {
        searchInput: userSearchInput,
        userEmail:
          user?.primaryEmailAddress
            ?.emailAddress,
        type: searchType,
        LibId: libId,
      },
    ]);

    router.push("/search/" + libId);
  };

  // ==========================================
  // AI BUTTON
  // ==========================================

  const handleAIButtonClick = async (type) => {
    if (!userSearchInput?.trim()) {
      setSelectedTool(type);
      setShowToolDescription(true);
      return;
    }

    let prompt = userSearchInput;

    switch (type) {
      // -------------------------
      // MATH
      // -------------------------

      case "Math AI":
        prompt = `
You are an expert mathematics tutor.

Solve the following problem step by step.

Show:
1. Given information
2. Calculation steps
3. Formula if needed
4. Final answer

Explain in a simple and clear way.

Problem:
${userSearchInput}
`;
        break;

      // -------------------------
      // TEXT
      // -------------------------

      case "AI Text Generator":
        prompt = `
You are a professional content writer.

Create clear, engaging and natural text based on the user's request.

User request:
${userSearchInput}
`;
        break;

      // -------------------------
      // POEM
      // -------------------------

      case "AI Poem Generator":
        prompt = `
You are a creative Tamil and English poet.

Write a beautiful poem based on the user's topic.

Make it emotional, creative and easy to read.

Topic:
${userSearchInput}
`;
        break;

      // -------------------------
      // STORY
      // -------------------------

      case "Storyteller":
        prompt = `
You are a professional storyteller.

Create an engaging short story based on the user's idea.

Include:
- Interesting characters
- Setting
- Conflict
- Emotional moments
- Satisfying ending

User idea:
${userSearchInput}
`;
        break;

      // -------------------------
      // NOVEL
      // -------------------------

      case "Novelist":
        prompt = `
You are an experienced novelist.

Develop the user's idea into a detailed novel-style story.

Include:
- Characters
- Setting
- Plot
- Character development
- Dialogue
- Emotions
- Interesting scenes

Write naturally and creatively.

User idea:
${userSearchInput}
`;
        break;

      // -------------------------
      // CODE
      // -------------------------

      case "AI Code":
        prompt = `
You are an expert software developer.

Help the user with the following programming request.

Provide:
1. Correct working code
2. Simple explanation
3. Important points
4. Fix common errors if applicable

If the user specifies a programming language, use that language.

Programming request:
${userSearchInput}
`;
        break;

      // -------------------------
      // IMAGE PROMPT
      // -------------------------

      case "Image Generator":
        prompt = `
You are an expert AI image prompt creator.

Create a detailed professional image-generation prompt based on the user's idea.

Include:
- Main subject
- Environment
- Background
- Lighting
- Camera angle
- Composition
- Colors
- Mood
- Photorealistic details
- Image quality

IMPORTANT:
Do not generate an actual image.
Return only a detailed image prompt.

User idea:
${userSearchInput}
`;
        break;

      // -------------------------
      // WRITER
      // -------------------------

      case "AI Writer":
        prompt = `
You are a professional AI writer.

Create high-quality, natural and professional content based on the user's request.

Make the writing:
- Clear
- Natural
- Engaging
- Grammatically correct
- Appropriate for the requested purpose

User request:
${userSearchInput}
`;
        break;

      default:
        prompt = userSearchInput;
    }

    const response = await callGroq(prompt);

    setAiAnswer(response);
  };

  // ==========================================
  // CLOSE TOOL DESCRIPTION
  // ==========================================

  const closeToolDescription = () => {
    setShowToolDescription(false);
    setSelectedTool(null);
  };

  // ==========================================
  // TOP NEWS
  // ==========================================

  const fetchTopNews = async () => {
    setLoading(true);

    try {
      const result = await axios.post(
        "/api/google-api",
        {
          searchInput:
            "Top Latest News & Updates",
          searchType: "Search",
        }
      );

      const newsItems =
        result?.data?.items?.map((item) => {
          const image =
            item?.pagemap?.cse_image?.[0]
              ?.src ||
            item?.pagemap?.cse_thumbnail?.[0]
              ?.src ||
            item?.pagemap?.metatags?.[0]?.[
              "og:image"
            ] ||
            item?.pagemap?.metatags?.[0]?.[
              "twitter:image"
            ] ||
            "/default-news.png";

          return {
            title:
              item?.title || "No Title",

            description:
              item?.snippet || "",

            url:
              item?.link || "#",

            img: image,

            thumbnail: image,
          };
        }) || [];

      setTopNews(newsItems);
    } catch (err) {
      console.error(
        "Error fetching Top news:",
        err
      );

      setTopNews([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-6 relative overflow-hidden">

      {/* Animated Galaxy Background */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />

        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse"
          style={{
            animationDelay: "1s",
          }}
        />

        <div
          className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse"
          style={{
            animationDelay: "2s",
          }}
        />

        <div
          className="absolute top-1/2 right-1/3 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"
          style={{
            animationDelay: "0.5s",
          }}
        />

        <div
          className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            animationDelay: "1.5s",
          }}
        />
      </div>

      {/* Header */}

      <div className="max-w-2xl w-full text-center mb-8 relative z-10">

        <div className="flex items-center justify-center gap-3 mb-4">

          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce">

            <Sparkles className="w-6 h-6 text-white" />

          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
            Askify
          </h1>

        </div>

        <p className="text-gray-300 mt-2 text-lg animate-fade-in">
          Your smart AI assistant for search,
          research, and more
        </p>

      </div>

      {/* Main Box */}

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl relative z-10">

        {/* AI Buttons */}

        <div className="flex flex-wrap justify-center gap-3 mb-6">

          {[
            "Math AI",
            "AI Text Generator",
            "AI Poem Generator",
            "Storyteller",
            "Novelist",
            "AI Code",
            "Image Generator",
            "AI Writer",
          ].map((item, idx) => {

            const IconComponent =
              aiToolIcons[item];

            return (
              <Button
                key={idx}
                variant="outline"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white hover:from-purple-700 hover:to-blue-700 rounded-full px-4 py-3 shadow-lg transform transition-all duration-300 hover:scale-105 border-white/20"
                onClick={() =>
                  handleAIButtonClick(item)
                }
              >
                <IconComponent className="w-4 h-4 mr-2" />

                {item}
              </Button>
            );
          })}

        </div>

        {/* Tool Description Modal */}

        {showToolDescription &&
          selectedTool && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20 shadow-2xl">

                <div className="flex items-center justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div className="p-2 bg-white/20 rounded-full">

                      {React.createElement(
                        aiToolIcons[selectedTool],
                        {
                          className:
                            "w-6 h-6 text-white",
                        }
                      )}

                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {selectedTool}
                    </h3>

                  </div>

                  <Button
                    variant="ghost"
                    onClick={
                      closeToolDescription
                    }
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>

                </div>

                <p className="text-gray-200 mb-6 leading-relaxed">
                  {
                    aiToolDescriptions[
                      selectedTool
                    ]
                  }
                </p>

                <div className="flex justify-end">

                  <Button
                    onClick={
                      closeToolDescription
                    }
                    className="bg-white/20 text-white hover:bg-white/30 rounded-full px-6"
                  >
                    Got it!
                  </Button>

                </div>

              </div>

            </div>
          )}

        {/* Search Tabs */}

        <div className="flex justify-between items-end gap-4">

          <div className="flex-1">

            <Tabs defaultValue="search" className="w-full">

              <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/10 border border-white/20 rounded-lg p-1">

                <TabsTrigger
                  value="search"
                  onClick={() =>
                    setSearchType("search")
                  }
                  className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 rounded-md py-2"
                >
                  <SearchCheck className="w-4 h-4" />

                  Search
                </TabsTrigger>

                <TabsTrigger
                  value="research"
                  onClick={() =>
                    setSearchType("research")
                  }
                  className="flex items-center justify-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 rounded-md py-2"
                >
                  <Atom className="w-4 h-4" />

                  Research
                </TabsTrigger>

              </TabsList>

              <TabsContent
                value="search"
                className="animate-fade-in mt-0"
              >

                <input
                  type="text"
                  placeholder="Ask Anything..."
                  value={userSearchInput}
                  onChange={(e) =>
                    setUserSearchInput(
                      e.target.value
                    )
                  }
                  className="w-full p-4 border border-white/30 bg-white/10 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    onSearchQuery()
                  }
                />

              </TabsContent>

              <TabsContent
                value="research"
                className="animate-fade-in mt-0"
              >

                <input
                  type="text"
                  placeholder="Research..."
                  value={userSearchInput}
                  onChange={(e) =>
                    setUserSearchInput(
                      e.target.value
                    )
                  }
                  className="w-full p-4 border border-white/30 bg-white/10 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    onSearchQuery()
                  }
                />

              </TabsContent>

            </Tabs>

          </div>

          {/* Right Buttons */}

          <div className="flex gap-2 items-center">

            {/* Models */}

            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  variant="ghost"
                  title="Models"
                  className="text-white hover:bg-white/20 border border-white/20 h-10 w-10 p-0"
                >
                  <Cpu className="h-4 w-4" />
                </Button>

              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-gradient-to-b from-purple-900 to-indigo-800 border-white/20 text-white">

                {AIModelsOption.map(
                  (model, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      className="hover:bg-white/20 focus:bg-white/20"
                    >
                      <div>
                        <h2 className="text-sm font-semibold">
                          {model.name}
                        </h2>

                        <p className="text-xs text-gray-300">
                          {model.desc}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )
                )}

              </DropdownMenuContent>

            </DropdownMenu>

            {/* Top News */}

            <Button
              variant="ghost"
              title="Discover Top News"
              onClick={fetchTopNews}
              disabled={loading}
              className="text-white hover:bg-white/20 border border-white/20 h-10 w-10 p-0"
            >
              <Globe className="h-4 w-4" />
            </Button>

            {/* File */}

            <Button
              variant="ghost"
              onClick={handleFileClick}
              title="Attach File"
              className="text-white hover:bg-white/20 border border-white/20 h-10 w-10 p-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Mic */}

            <Button
              variant="ghost"
              onClick={handleMicClick}
              title="Voice Input"
              className="text-white hover:bg-white/20 border border-white/20 h-10 w-10 p-0"
            >
              {isRecording ? (
                <Mic className="text-red-400 h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            {/* Search */}

            <Button
              onClick={onSearchQuery}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 h-10 px-4"
            >
              {!userSearchInput ? (
                <AudioLines className="h-4 w-4 animate-pulse" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>

          </div>

        </div>

        {/* Hidden File Input */}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Loading */}

        {loading && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20 text-white flex items-center gap-3">

            <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />

            <span>
              Askify AI is thinking...
            </span>

          </div>
        )}

        {/* AI Answer */}

        {aiAnswer && !loading && (
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white whitespace-pre-wrap">

            <div className="flex items-center gap-2 mb-2">

              <Sparkles className="w-4 h-4 text-purple-300" />

              <span className="font-semibold text-purple-300">
                AI Response:
              </span>

            </div>

            {aiAnswer}

          </div>
        )}

        {/* Top News */}

        {topNews.length > 0 && (
          <div className="mt-6 w-full">

            {topNews.map((news, index) => (
              <div
                key={`${news.url}-${index}`}
                className="mb-4"
              >
                <NewsCard news={news} />
              </div>
            ))}

          </div>
        )}

      </div>

      {/* Animations */}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>

    </div>
  );
}

export default ChatInputBox;