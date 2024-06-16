import React from "react";
import { Title } from "../types/types";

interface Props {
  title: Title;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableData = (props: Props) => {
  const { title, value, onChange } = props;
  return (
    <td className="px-6 py-4 font-medium text-gray-900">
      <form className="w-16">
        <input
          id={title.ID.toString()}
          value={value}
          type="number"
          className="w-16 border-2 border-gray-400 rounded-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={onChange}
        />
      </form>
    </td>
  );
};

export default TableData;
