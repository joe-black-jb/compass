import React from "react";

interface Props {
  label: string;
  onClick?: () => void;
}

const Button = (props: Props) => {
  return (
    <button
      className="hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded border-2 border-gray-700"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};

export default Button;
