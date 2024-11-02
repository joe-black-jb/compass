import React from "react";

interface Props {
  text: string;
}
const DataTypeIcon = (props: Props) => {
  const { text } = props;

  return (
    <div className={`font-bold bg-green-300 py-1 px-4 rounded-lg`}>{text}</div>
  );
};

export default DataTypeIcon;
