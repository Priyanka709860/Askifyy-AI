"use client";

import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { Clock, Link, Send, Copy, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import moment from 'moment';

// Dynamically import UserButton to ensure it's client-only
const ClerkUserButton = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.UserButton),
  { ssr: false }
);

export default function Header({ searchInputRecord }) {
  const [timeFromNow, setTimeFromNow] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Set share URL on client side
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Only calculate relative time on client
  useEffect(() => {
    if (searchInputRecord?.created_at) {
      setTimeFromNow(moment(searchInputRecord.created_at).fromNow());
    }
  }, [searchInputRecord]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Askify Search: ${searchInputRecord?.searchInput}`,
          text: `Check out this search result for "${searchInputRecord?.searchInput}" on Askify`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <div className='p-4 border-b border-white/20 bg-white/10 backdrop-blur-sm flex justify-between items-center glass-header'>
      <div className='flex gap-3 items-center'>
        <ClerkUserButton />

        <div className='flex gap-2 items-center'>
          <Clock className='h-4 w-4 text-indigo-200' />
          <h2 className='text-sm text-indigo-200 font-medium'>{timeFromNow}</h2>
        </div>
      </div>

      <h2 className='line-clamp-1 max-w-md text-white font-semibold text-lg text-center px-4'>
        {searchInputRecord?.searchInput}
      </h2>

      <div className="flex gap-2">
        <Button 
          onClick={handleCopyLink}
          className="bg-white/15 text-white hover:bg-white/25 border border-white/30 transition-all duration-200 hover:scale-105"
          size="sm"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Link className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          onClick={handleShare}
          className="bg-white text-indigo-700 hover:bg-indigo-100 border-0 font-medium transition-all duration-200 hover:scale-105 shadow-md"
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Toast notification for copy */}
      {copied && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right-4 duration-300 z-50">
          Link copied to clipboard!
        </div>
      )}

      <style jsx>{`
        .glass-header {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}