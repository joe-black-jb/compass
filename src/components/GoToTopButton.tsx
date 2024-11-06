import React from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  onClick: () => void;
}

const GoToTopButton = (props: Props) => {
  const { onClick } = props;
  return (
    <div className="w-fit bg-white hover:bg-green-100 mt-1 p-2 rounded-full">
      <ArrowUpCircleIcon
        onClick={onClick}
        className="size-5 h-full cursor-pointer"
      />
    </div>
  );
};

export default GoToTopButton;
