import React, { Suspense } from "react";
import { Company, Title, TitleFamily, ValueObj } from "../types/types";
import TableData from "./TableData";
import Button from "./Button";
import classNames from "classnames";
import EditIcon from "./EditIcon";
import { Link } from "react-router-dom";

interface Props {
  company: Company;
  family: TitleFamily[];
  header: string;
  values: ValueObj[];
  bgColor?: string;
  categorySum?: string;
  sumMap?: Map<string, number>;
  admin?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TitleTable = (props: Props) => {
  const {
    company,
    family,
    header,
    values,
    bgColor,
    categorySum,
    sumMap,
    admin,
    onChange,
    onSubmit,
  } = props;

  let bgColorClass = "bg-white";

  if (bgColor) {
    bgColorClass = bgColor;
  }

  const defaultTableClass =
    "rounded-lg w-full text-sm text-left rtl:text-right text-gray-700";
  const mergedTableClass = classNames(defaultTableClass, bgColorClass);

  const getValue = (child: Title): string | undefined => {
    const title = values.find((value) => value.titleId === child.ID.toString());
    return title?.value;
  };

  const goToEdit = (target: string): string => {
    const targetTitle = company?.Titles?.find((title) => title.Name === target);
    if (targetTitle) {
      const url = `/company/${company?.ID?.toString()}/title/${targetTitle?.ID?.toString()}/edit`;
      return url;
    }
    return "";
  };

  const getParentSum = (parent: string): string | undefined => {
    if (sumMap) {
      const value = sumMap.get(parent)?.toString();

      return value;
    }
    return undefined;
  };

  return (
    <div className="m-2">
      <Suspense fallback={<div>Loading...</div>}>
        <table className={mergedTableClass}>
          <thead className="text-sm uppercase font-bold">
            <tr className="border-gray-700">
              <th scope="col" className="px-6 py-4">
                {header}
              </th>
              {categorySum && (
                <th scope="col" className="px-6 py-4">
                  {categorySum}
                </th>
              )}
            </tr>
          </thead>
          {family.length &&
            family.map((parent) => (
              <tbody key={parent.parent}>
                <tr key={parent.parent} className="border-t border-gray-700">
                  <td className="flex justify-between items-center px-6 py-4 font-medium text-gray-900 pl-10">
                    <div>{parent.parent}</div>
                    <div>{getParentSum(parent.parent)}</div>
                    {admin && (
                      <Link to={goToEdit(parent.parent)}>
                        <EditIcon />
                      </Link>
                    )}
                  </td>
                </tr>
                {parent.child.length &&
                  parent.child.map((child) => (
                    <tr key={child.ID} className="border-t border-gray-700">
                      <td className="truncate px-6 py-4 font-medium text-gray-900 pl-20">
                        {child.Name}
                      </td>
                      <TableData
                        company={company}
                        title={child}
                        value={getValue(child)}
                        onChange={onChange}
                        admin={admin}
                      />
                    </tr>
                  ))}
              </tbody>
            ))}
        </table>
      </Suspense>
    </div>
  );
};

export default TitleTable;
