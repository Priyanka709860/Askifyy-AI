import React from 'react';
import Image from 'next/image';

function SourceListTab({ chats }) {
  // Fallback loader for external images
  const safeLoader = ({ src, width, quality }) => {
    try {
      const url = new URL(src);
      return src; // valid URL, Next.js can attempt to load
    } catch (err) {
      return "/placeholder.png"; // invalid or unconfigured URL
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      {chats?.searchResult.map((item, index) => (
        <a
  key={index}
  href={item.url || "#"}
  target="_blank"
  rel="noopener noreferrer"
  className="block hover:bg-gray-100 rounded p-2 transition-colors"
>
          <div className='flex gap-2 mt-4 items-center'>
            <h2>{index + 1}</h2>
            <Image
              loader={safeLoader}
              src={item?.img || "/placeholder.png"}
              alt={item?.title || "source image"}
              width={20}
              height={20}
              className='rounded-full w-[20px] h-[20px] border'
            />
            <div>
              <h2 className='text-xs'>{item.long_name}</h2>
            </div>
          </div>
          <h2 className='mt-1 line-clamp-1 font-bold text-lg text-gray-600'>{item.title}</h2>
          <h2 className='mt-1 text-xs text-gray-600'>{item.title}</h2>
        </a>
      ))}
    </div>
  );
}

export default SourceListTab;
