import React, { useState, useEffect } from 'react';
import VideoListTab from './VideoListTab';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Suppose you fetch data from an API here and get results
    fetch('/api/getVideos?query=someSearch')
      .then(res => res.json())
      .then(data => {
        // assuming data.videos is an array of videos
        setSearchResults(data.videos);
      });
  }, []);

  return (
    <div>
      <h1>Search Videos</h1>
      <VideoListTab videos={searchResults} />
    </div>
  );
}

export default SearchPage;
