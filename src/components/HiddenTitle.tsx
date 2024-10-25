import React from "react";
import { TitleData } from "../types/types";

interface Props {
  key: string;
  titleData: TitleData;
}

const HiddenTitle = (props: Props) => {
  const { key, titleData } = props;
  return (
    <div key={key} className="mt-4 w-fit">
      <div
        className={`bg-${titleData.color}-100 px-2 py-1 rounded-2xl border-2 border-gray-600`}
      >
        {titleData.titleName} {titleData.value} ({titleData.ratio}%)
      </div>
    </div>
  );
};

export default HiddenTitle;
