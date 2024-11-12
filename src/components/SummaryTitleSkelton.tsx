import React from "react";

interface Props {
  hasMargin: boolean;
}

const SummaryTitleSkelton = (props: Props) => {
  const { hasMargin } = props;

  if (hasMargin) {
    return (
      <div className="sm:ml-10 h-[56px] rounded-lg bg-green-300 animate-pulse mb-8 w-full sm:w-[240px] lg:w-[350px] mx-auto sm:mx-0"></div>
    );
  }
  return (
    <div className="h-[56px] rounded-lg bg-green-300 animate-pulse mb-8 w-full sm:w-[240px] lg:w-[350px] mx-auto sm:mx-0"></div>
  );
};

export default SummaryTitleSkelton;
