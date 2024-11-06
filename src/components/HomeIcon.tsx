import React from "react";
import { HomeIcon as Home } from "@heroicons/react/24/outline";

interface Props {
  onClick: () => void;
}

const HomeIcon = (props: Props) => {
  const { onClick } = props;

  return (
    <div className="w-fit bg-white hover:bg-green-100 py-2 px-2 rounded-full">
      <Home onClick={onClick} className="size-5 h-full cursor-pointer" />
    </div>
  );
};

export default HomeIcon;
