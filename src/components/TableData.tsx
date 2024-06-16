import React, { useState } from "react";
import { Title } from "../types/types";

interface Props {
  title: Title;
}

const TableData = (props: Props) => {
  const { title } = props;
  const [value, setValue] = useState(title.Value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log("inputValue: ", inputValue);
    setValue(inputValue);
  };
  return (
    <td className="px-6 py-4 font-medium text-gray-900">
      <form className="w-16">
        <input
          id={title.ID.toString()}
          value={value}
          type="number"
          className="w-16 border-2 border-gray-400 rounded-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={handleChange}
        />
      </form>
    </td>
  );
};

export default TableData;
