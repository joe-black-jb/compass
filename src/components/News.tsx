import React, { useEffect, useState } from "react";
import { getLatestNews } from "../api/api";
import { NewsList } from "../types/types";
import NewsCard from "./NewsCard";
import NewsCardSkelton from "./NewsCardSkelton";

const News = () => {
  const [news, setNews] = useState<NewsList>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ダミー配列 (length = 10)
  const dummyNews = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    const newsList = await getLatestNews();
    if (newsList) {
      setNews(newsList);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {isLoading ? (
        <>
          {dummyNews.map((dummy, index) => (
            <NewsCardSkelton key={index} />
          ))}
        </>
      ) : (
        <>
          {news?.news_list &&
            news.news_list.length > 0 &&
            news.news_list.map((news) => (
              <NewsCard key={news.link} news={news} />
            ))}
        </>
      )}
    </div>
  );
};

export default News;
