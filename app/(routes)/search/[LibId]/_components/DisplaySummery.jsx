import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

function DisplaySummery({ aiResp }) {
  return (
    <div className='mt-7' >
      {!aiResp && 
        <div>
          <div className='w-full h-5 bg-accent animate-pulse rounded-md'></div>
          <div className='w-1/2 mt-2 h-5 bg-accent animate-pulse rounded-md'></div>
          <div className='w-[70%] mt-2 h-5 bg-accent animate-pulse rounded-md'></div>
          </div>
      }
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-blue-800 mb-4 leading-snug" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-semibold text-blue-700 mb-3 leading-snug" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-semibold text-blue-600 mt-4 mb-2 leading-tight" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4 break-words" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 underline hover:text-blue-800 break-all"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 leading-relaxed" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed mb-6" {...props} />
          ),
          table: ({ node, ...props }) => (
            <table className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2 break-words" {...props} />
          ),

          // ✅ Correct Code Block Styling
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
             <SyntaxHighlighter
  style={okaidia}
  language={match[1]}
  PreTag="div"
  className="rounded-md overflow-x-auto w-full max-w-full"
  wrapLongLines={true}   // 👈 important: forces wrapping in code blocks
>
  {String(children).replace(/\n$/, "")}
</SyntaxHighlighter>

            ) : (
              <code className="bg-gray-100 px-1 rounded text-sm font-mono text-black break-words" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {aiResp}
      </ReactMarkdown>
    </div>
  );
}

export default DisplaySummery;

