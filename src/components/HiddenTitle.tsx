import React from "react";
import { TitleData } from "../types/types";

interface Props {
  titleData: TitleData;
}

const HiddenTitle = (props: Props) => {
  const { titleData } = props;
  return (
    <div key={titleData.titleName} className="mt-4 w-fit">
      <div
        className={`bg-${titleData.color}-100 px-2 py-1 rounded-2xl border-2 border-gray-600`}
      >
        {titleData.titleName} {titleData.value} ({titleData.ratio}%)
      </div>
    </div>
  );
};

export default HiddenTitle;
