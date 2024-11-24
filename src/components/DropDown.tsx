import React from "react";
import { Option } from "../types/types";

interface Props {
  options: Option[];
  onChange: (key: string) => void;
}

const DropDown = (props: Props) => {
  const { options, onChange } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };
  return (
    <select
      className="text-sm text-gray-700 rounded border-[1px] border-gray-700"
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.title}
        </option>
      ))}
    </select>
  );
};

export default DropDown;
