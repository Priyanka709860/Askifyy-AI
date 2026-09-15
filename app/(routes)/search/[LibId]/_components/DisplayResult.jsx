"use client";
import { Loader2Icon, LucideImage, LucideList, LucideSparkles, LucideVideo, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AnswerDisplay from './AnswerDisplay';
import axios from "axios";
import { supabase } from '@/services/supabase';
import { useParams } from 'next/navigation';
import ImageListTab from './ImageListTab';
import SourceListTab from './SourceListTab';
import { Button } from '@/components/ui/button';
import VideoListTab from './VideoListTab';

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState('');
  const [searchResult, setSearchResult] = useState(searchInputRecord);
  const { LibId } = useParams();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!searchInputRecord) return;

    if (!hasFetched) {
      if (searchInputRecord?.Chats?.length === 0) {
        GetSearchApiResult();
      } else {
        GetSearchRecords();
      }
      setHasFetched(true);
    }
  }, [searchInputRecord, hasFetched]);

  const GetSearchApiResult = async () => {
    setLoadingSearch(true);

    const query = userInput || searchInputRecord?.searchInput;
    if (!query) {
      console.error("❌ Missing search input, skipping API call");
      setLoadingSearch(false);
      return;
    }

    const result = await axios.post('/api/google-api', {
      searchInput: query,
      searchType: searchInputRecord?.type ?? 'Search'
    });

    const searchResp = result.data;

    const formattedSearchResp = searchResp?.items?.map((item) => ({
      title: item?.title,
      description: item?.snippet,
      long_name: item?.pagemap?.metatags?.[0]?.["og:site_name"] || null,
      img: item?.pagemap?.cse_image?.[0]?.src || null,
      url: item?.link,
      thumbnail: item?.pagemap?.cse_thumbnail?.[0]?.src || null,
    }));

    const { data, error } = await supabase
      .from('Chats')
      .insert([
        {
          LibId: LibId,
          searchResult: formattedSearchResp,
          userSearchInput: userInput || searchInputRecord?.searchInput
        },
      ])
      .select();

    await GetSearchRecords();
    setLoadingSearch(false);

    if (data && data.length > 0) {
      await GenerateAIResp(formattedSearchResp, data[0]?.id);
    } else {
      console.error('Supabase insert returned no data:', error);
    }
    setUserInput("");
  };

  const GenerateAIResp = async (formattedSearchResp, recordId) => {
    const result = await axios.post('/api/llm-model', {
      searchInput: searchInputRecord?.searchInput,
      searchResult: formattedSearchResp,
      recordId: recordId
    });

    const runId = result.data?.id || result.data?.runId || result.data?.recordId;
    if (!runId) {
      console.error("❌ No runId returned from LLM API. Response:", result.data);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const runResp = await axios.post('/api/get-inngest-status', { runId });
        const status = runResp.data?.data?.[0]?.status;

        if (status === "Completed") {
          await GetSearchRecords();
          clearInterval(interval);
        }

        if (runResp.data?.error) {
          clearInterval(interval);
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 2000);
  };

  const GetSearchRecords = async () => {
    let { data: Library } = await supabase
      .from('Library')
      .select('*,Chats(*)')
      .eq('LibId', LibId)
      .order('id', { foreignTable: 'Chats', ascending: true });
    setSearchResult(Library[0]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden galaxy-bg">
      {/* Animated stars background */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Nebula glow effects */}
      <div className="nebula-glow nebula-1"></div>
      <div className="nebula-glow nebula-2"></div>
      <div className="nebula-glow nebula-3"></div>

      {/* Header with website name */}
      <div className="text-center pt-8 pb-4 relative z-10">
        <h1 className="text-6xl font-bold text-white mb-2 tracking-wider drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          Askify
        </h1>
        <p className="text-indigo-300/80 text-lg font-light tracking-wide">
          Your intelligent search companion
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-32 relative z-10">
        {!searchResult?.Chats && (
          <div className="glass-card p-8 rounded-2xl">
            <div className='w-full h-5 bg-indigo-400/20 animate-pulse rounded-lg'></div>
            <div className='w-1/2 mt-3 h-5 bg-indigo-400/20 animate-pulse rounded-lg'></div>
            <div className='w-[70%] mt-3 h-5 bg-indigo-400/20 animate-pulse rounded-lg'></div>
          </div>
        )}

        {searchResult?.Chats?.length > 0 && searchResult.Chats.map((chat, index) => {
          const tabs = [
            { label: 'Answer', icon: LucideSparkles },
            { label: 'Images', icon: LucideImage },
            { label: 'Video', icon: LucideVideo },
            {
              label: 'Sources',
              icon: LucideList,
              badge: chat?.searchResult?.length || 0,
            },
          ];

          return (
            <div key={index} className='glass-card rounded-2xl p-7 mb-6'>
              <h2 className='font-bold text-3xl text-white mb-5 tracking-wide drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]'>
                {chat?.userSearchInput}
              </h2>

              <div className="flex items-center gap-8 border-b border-white/10 pb-3">
                {tabs.map(({ label, icon: Icon, badge }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label + index)}
                    className={`flex items-center gap-2.5 relative text-sm font-medium transition-all duration-300 py-1 ${
                      activeTab === label + index
                        ? 'text-white'
                        : 'text-indigo-300/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {badge > 0 && (
                      <span className="ml-0.5 text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                    {activeTab === label + index && (
                      <span className="absolute -bottom-3 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {activeTab === 'Answer' + index && <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />}
                {activeTab === 'Images' + index && <ImageListTab chat={chat} />}
                {activeTab === 'Video' + index && <VideoListTab chat={chat} />}
                {activeTab === 'Sources' + index && <SourceListTab chats={chat} />}
              </div>
            </div>
          );
        })}

        {/* Search Input - Fixed at bottom */}
        <div className='glass-card w-full rounded-2xl shadow-2xl p-4 fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-2xl z-20 border border-white/5'>
          <div className="flex items-center gap-3">
            <input
              placeholder='Ask anything...'
              className='outline-none w-full bg-transparent text-white placeholder-indigo-300/50 text-lg px-1'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && userInput && GetSearchApiResult()}
            />
            {userInput && (
              <Button
                onClick={GetSearchApiResult}
                disabled={loadingSearch}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl px-5 py-2 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
              >
                {loadingSearch ? <Loader2Icon className='animate-spin' /> : <Send className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .galaxy-bg {
          background: 
            radial-gradient(ellipse at 20% 50%, #1a1040 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, #2d1b69 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, #0f0a2a 0%, transparent 60%),
            linear-gradient(180deg, #0a0618 0%, #1a1040 30%, #2d1b69 60%, #1a1040 80%, #0a0618 100%);
          background-attachment: fixed;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        /* Nebula glow effects */
        .nebula-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.3;
        }

        .nebula-1 {
          top: -10%;
          left: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, #7c3aed, transparent 70%);
          animation: floatGlow 20s ease-in-out infinite;
        }

        .nebula-2 {
          bottom: -10%;
          right: -10%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, #ec4899, transparent 70%);
          animation: floatGlow 25s ease-in-out infinite reverse;
        }

        .nebula-3 {
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          width: 40%;
          height: 40%;
          background: radial-gradient(circle, #8b5cf6, transparent 70%);
          animation: floatGlow 30s ease-in-out infinite;
        }

        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Stars animation */
        .stars, .stars2, .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .stars:before, .stars2:before, .stars3:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.8), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: stars 30s linear infinite;
        }

        .stars2:before {
          background-image:
            radial-gradient(2px 2px at 10px 10px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 30px 50px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 70px 20px, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 110px 60px, rgba(255,255,255,0.7), transparent),
            radial-gradient(2px 2px at 140px 10px, rgba(255,255,255,0.6), transparent);
          animation: stars 40s linear infinite;
          opacity: 0.7;
        }

        .stars3:before {
          background-image:
            radial-gradient(2px 2px at 5px 5px, rgba(255,255,255,0.5), transparent),
            radial-gradient(2px 2px at 25px 35px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 65px 15px, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 105px 45px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 135px 5px, rgba(255,255,255,0.5), transparent);
          animation: stars 50s linear infinite;
          opacity: 0.5;
        }

        @keyframes stars {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-100px);
          }
        }

        /* Smooth scroll for content */
        .galaxy-bg {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        .galaxy-bg::-webkit-scrollbar {
          width: 6px;
        }

        .galaxy-bg::-webkit-scrollbar-track {
          background: transparent;
        }

        .galaxy-bg::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }

        .galaxy-bg::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

export default DisplayResult;