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
    "bg-white hover:bg-green-100 text-xs text-gray-700 font-bold py-1 px-3 rounded border-[1px] border-gray-700";
  const mergedClassName = classNames(defaultClassName, className);
  return (
    <button className={mergedClassName} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
