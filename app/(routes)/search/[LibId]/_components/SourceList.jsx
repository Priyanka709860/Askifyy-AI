"use client";

import React from 'react';
import Image from 'next/image';

function SourceList({ webResult,loadingSearch}) {
  return (
      <div className='flex flex-wrap gap-2 mt-5'>
        {webResult?.map((item, index) => (
          <div
            key={index}
            className='p-3 bg-accent rounded-lg w-[190px] cursor-pointer hover:bg-[#e1e3da]'
            onClick={() => window.open(item.url, '_blank')}
          >
            <div className='flex gap-2 items-center'>
              <Image
                src={
                  item?.img &&
                  (item.img.startsWith("https://lh3.googleusercontent.com") ||
                   item.img.startsWith("https://encrypted-tbn0.gstatic.com") ||
                   item.img.startsWith("https://www.google.com") ||
                   item.img.startsWith("https://cdn.sanity.io"))
                    ? item.img
                    : "/placeholder.png"
                }
                alt={item?.name || ""}
                width={30}
                height={40}
              />
              <h2 className='text-xs break-words'>{item?.long_name}</h2>
            </div>
            <h2 className='line-clamp-2 text-black text-xs break-words'>
              {item?.description}
            </h2>
          </div>
        ))}
        {loadingSearch && <div className='flex flex-wrap gap-2'>
        {[1,2,3,4].map((item,index)=>(
          <div className='w-[200px] h-[100px] rounded-2xl bg-accent animate-pulse' key={index}>
            </div>

        ))}
      </div>}      
    </div>
  );
}

export default SourceList;
