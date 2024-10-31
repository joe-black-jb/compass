import React from "react";

interface Props {
  title: string;
}
const TitleMarker = (props: Props) => {
  const { title } = props;
  return (
    <div className="flex justify-center xl:w-[600px] xl:ml-[10%]">
      <div className="w-fit px-2 text-center bg-gradient-to-b from-transparent via-white to-green-300 my-4 font-bold text-lg">
        {title}
      </div>
    </div>
  );
};

export default TitleMarker;
