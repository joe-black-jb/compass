import React, { useEffect, useState } from "react";
import { getLatestNews } from "../api/api";
import { NewsList } from "../types/types";
import NewsCard from "./NewsCard";

const News = () => {
  const [news, setNews] = useState<NewsList>();

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    const newsList = await getLatestNews();
    if (newsList) {
      setNews(newsList);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {news?.news_list &&
        news.news_list.length > 0 &&
        news.news_list.map((news) => <NewsCard key={news.link} news={news} />)}
    </div>
  );
};

export default News;
