import React from "react";

function NewsCard({ news }) {
    return (
        <div
            className="border rounded-2xl mt-6 cursor-pointer"
            onClick={() => window.open(news?.url, '_blank')}
        >
            <img
                src={news?.thumbnail || '/default-news.png'}
                alt={news?.title}
                width={700}
                height={300}
                className="rounded-2xl w-full"
            />
            <div className="p-4">
                <h2 className="font-bold text-xl text-gray-400">{news?.title}</h2>
                <p className="text-md mt-2 line-clamp-2 text-gray-500">
                    {news?.description ? news.description.replace(/<strong>/g, '').replace(/<\/strong>/g, '') : ''}
                </p>
            </div>
        </div>
    );
}

export default NewsCard;
