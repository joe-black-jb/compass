import React from "react";

interface Props {
  label: string;
  onClick?: () => void;
}

const Button = (props: Props) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};

export default Button;
