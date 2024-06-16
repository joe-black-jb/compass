import React, { Suspense } from "react";
import { Title, TitleFamily, ValueObj } from "../types/types";
import TableData from "./TableData";
import Button from "./Button";
import classNames from "classnames";

interface Props {
  family: TitleFamily[];
  header: string;
  values: ValueObj[];
  bgColor?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TitleFormTable = (props: Props) => {
  const { family, header, values, bgColor, onChange, onSubmit } = props;

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

  return (
    <div className="m-2">
      <Suspense fallback={<div>Loading...</div>}>
        <form onSubmit={onSubmit} className="relative">
          <table className={mergedTableClass}>
            <thead className="text-sm uppercase font-bold">
              <tr className="border-gray-700">
                <th scope="col" className="px-6 py-4">
                  {header}
                </th>
              </tr>
            </thead>
            {family.length &&
              family.map((parent) => (
                <tbody key={parent.parent}>
                  <tr key={parent.parent} className="border-t border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 pl-10">
                      {parent.parent}
                    </td>
                  </tr>
                  {parent.child.length &&
                    parent.child.map((child) => (
                      <tr key={child.ID} className="border-t border-gray-700">
                        <td className="truncate px-6 py-4 font-medium text-gray-900 pl-20">
                          {child.Name}
                        </td>
                        <TableData
                          title={child}
                          value={getValue(child)}
                          onChange={onChange}
                        />
                      </tr>
                    ))}
                </tbody>
              ))}
          </table>
          <div className="flex justify-end">
            <Button label="更新" onClick={() => onSubmit} className="mt-4" />
          </div>
        </form>
      </Suspense>
    </div>
  );
};

export default TitleFormTable;
