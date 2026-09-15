import Image from 'next/image'
import React from 'react'

function ImageListTab({ chat }) {
  // Fallback to empty array if searchResult is undefined
  const images = chat?.searchResult || [];

  if (images.length === 0) {
    return <p className="text-gray-500 mt-2">No images found</p>;
  }

  return (
    <div className='flex gap-5 flex-wrap mt-6'> 
      {images.map((item, index) => (
        <Image
          src={item?.thumbnail || "/placeholder.png"}   // fallback
          alt={item?.title || "image"}                  // safe alt
          width={200}
          height={200}
          key={index}
          className='bg-accent rounded-xl'
        />
      ))}
    </div>
  )
}

export default ImageListTab
