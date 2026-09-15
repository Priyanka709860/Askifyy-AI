'use client'
import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './_components/NewsCard';

// Placeholder image when API doesn't return an image
const DEFAULT_IMAGE = '/default-news.png';

const options = [
    { title: 'Top', icon: Star },
    { title: 'Tech & Science', icon: Cpu },
    { title: 'Finance', icon: DollarSign },
    { title: 'Art & Culture', icon: Palette },
    { title: 'Sports', icon: Volleyball },
];

function Discover() {
    const [selectedOption, setSelectedOption] = useState('Top');
    const [latestNews, setLatestNews] = useState([]);

    useEffect(() => {
        if (selectedOption) {
            GetSearchResult();
        }
    }, [selectedOption]);

    const GetSearchResult = async () => {
        try {
            const result = await axios.post('/api/google-api', {
                searchInput: `${selectedOption} Latest News & Updates`,
                searchType: 'Search',
            });

            const webSearchResult = result?.data?.items?.map(item => {
                // Try multiple image sources
                let image = null;

                if (item?.pagemap?.cse_image?.length > 0) {
                    image = item.pagemap.cse_image[0].src;
                } else if (item?.pagemap?.cse_thumbnail?.length > 0) {
                    image = item.pagemap.cse_thumbnail[0].src;
                } else if (item?.pagemap?.metatags?.length > 0) {
                    const meta = item.pagemap.metatags[0];
                    image = meta['og:image'] || meta['twitter:image'] || null;
                }

                // Fallback to default image
                if (!image) image = DEFAULT_IMAGE;

                return {
                    title: item?.title || 'No Title',
                    description: item?.snippet || '',
                    url: item?.link || '#',
                    img: image,
                    thumbnail: image,
                };
            }) || [];

            setLatestNews(webSearchResult);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    return (
        <div className="mt-20 px-10 md:px-20 lg:px-36 xl:px-56">
            <h2 className="font-bold text-3xl flex gap-2 items-center">
                <Globe />
                <span>Discover</span>
            </h2>

            <div className="flex mt-5 gap-2 flex-wrap">
                {options.map(option => (
                    <div
                        key={option.title}
                        onClick={() => setSelectedOption(option.title)}
                        className={`flex gap-1 p-1 px-3 hover:text-primary items-center rounded-full cursor-pointer ${
                            selectedOption === option.title ? 'bg-accent text-primary' : ''
                        }`}
                    >
                        <option.icon className="h-4 w-4" />
                        <h2 className="text-sm">{option.title}</h2>
                    </div>
                ))}
            </div>

            <div className="w-full mt-6">
                {latestNews?.map((news, index) => {
                    const isFullWidth = index % 4 === 0;

                    if (isFullWidth) {
                        return (
                            <div key={news.url} className="w-full mb-4">
                                <NewsCard news={news} />
                            </div>
                        );
                    }

                    const group = latestNews.slice(index, index + 3);
                    if (index % 4 === 1) {
                        return (
                            <div key={`group-${index}`} className="grid grid-cols-2 gap-3 mb-4">
                                {group.map(newsItem => (
                                    <NewsCard news={newsItem} key={newsItem.url} />
                                ))}
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
}

export default Discover;
