import React from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  onClick: () => void;
}

const GoBackIcon = (props: Props) => {
  const { onClick } = props;
  return (
    <div className="bg-white hover:bg-green-100 mt-1 p-2 rounded-full">
      <ArrowUturnLeftIcon
        onClick={onClick}
        className="size-6 h-full cursor-pointer"
      />
    </div>
  );
};

export default GoBackIcon;
