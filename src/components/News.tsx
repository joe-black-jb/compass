import React, { useEffect, useState } from "react";
import { getLatestNews } from "../api/api";
import { NewsList } from "../types/types";
import NewsCard from "./NewsCard";
import LoadingIcon from "./LoadingIcon";

const News = () => {
  const [news, setNews] = useState<NewsList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    setIsLoading(true);
    const newsList = await getLatestNews();
    if (newsList) {
      setNews(newsList);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {news?.news_list &&
        news.news_list.length > 0 &&
        news.news_list.map((news) => <NewsCard key={news.link} news={news} />)}
    </div>
  );
};

export default News;
