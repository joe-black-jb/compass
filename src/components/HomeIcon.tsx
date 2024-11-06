import React from "react";
import { HomeIcon as Home } from "@heroicons/react/24/outline";

interface Props {
  onClick: () => void;
}

const HomeIcon = (props: Props) => {
  const { onClick } = props;

  return (
    <div className="bg-white hover:bg-green-100 p-1.5 rounded-full">
      <Home onClick={onClick} className="size-6 h-full cursor-pointer" />
    </div>
  );
};

export default HomeIcon;
