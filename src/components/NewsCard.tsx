import React from "react";
import { NewsData } from "../types/types";

interface Props {
  news: NewsData;
}

const NewsCard = (props: Props) => {
  const { news } = props;

  return (
    <div className="xs:max-w-sm overflow-hidden hover:bg-green-100 rounded-t-lg border-b-[1px] border-gray-400 mt-2 mr-2 ml-2 pb-2">
      <a href={news.link} target="secret">
        <div className="px-6 py-4">
          <div className="font-bold mb-2">{news.title}</div>
          <p className="text-gray-700 text-sm line-clamp-2">{news.summary}</p>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
