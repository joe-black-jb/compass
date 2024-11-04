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
    "bg-white hover:bg-green-200 text-xs text-gray-700 font-bold py-2 px-4 rounded border-1 border-gray-700";
  const mergedClassName = classNames(defaultClassName, className);
  return (
    <button className={mergedClassName} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
