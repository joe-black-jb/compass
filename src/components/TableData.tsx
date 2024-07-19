import React from "react";
import { Company, Title } from "../types/types";
import { Link } from "react-router-dom";
import EditIcon from "./EditIcon";

interface Props {
  admin?: boolean;
  company: Company;
  title: Title;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableData = (props: Props) => {
  const { admin, company, title, value } = props;

  const goToEdit = () => {
    const url = `/company/${company?.ID?.toString()}/title/${title?.ID?.toString()}/edit`;
    return url;
  };

  return (
    <td className="px-6 py-4 font-medium text-gray-900">
      <div className="w-32 flex justify-between items-center">
        <div id={title.ID.toString()} className="w-16">
          {value}
        </div>
        {admin && (
          <Link to={goToEdit()} className="hover:bg-gray-200 rounded-full">
            <EditIcon />
          </Link>
        )}
      </div>
    </td>
  );
};

export default TableData;
