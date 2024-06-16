import classNames from "classnames";
import React from "react";

interface Props {
  label: string;
  onClick?: () => void;
  className?: string;
}

const Button = (props: Props) => {
  const { className, label, onClick } = props;
  const defaultClassName =
    "hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded border-2 border-gray-700";
  const mergedClassName = classNames(defaultClassName, className);
  return (
    <button className={mergedClassName} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
