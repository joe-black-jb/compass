import React, { Suspense, useEffect, useState } from "react";
import { TitleFamily } from "../types/types";
import TableData from "./TableData";
import { cloneDeep } from "lodash";

interface Props {
  family: TitleFamily[];
  header: string;
}

const TitleFormTable = (props: Props) => {
  const { family, header } = props;

  let parentObj: any = {};
  // let valueObj: any = {};
  family.forEach((parent) => {
    const copy = cloneDeep(parentObj);
    const name = parent.parent;
    copy[name] = `${name} をsetしました`;
    parentObj = { ...parentObj, ...copy };
  });
  // console.log("valueObj: ", valueObj);
  // console.log("parentObj: ", parentObj);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <table className="w-full text-sm text-left rtl:text-right text-gray-700">
        <thead className="text-sm text-gray-700 uppercase font-bold">
          <tr className="border-b border-gray-700">
            <th scope="col" className="px-6 py-4">
              {header}
            </th>
          </tr>
        </thead>
        {family.length &&
          family.map((parent) => (
            <tbody key={parent.parent}>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 pl-10">
                  {parent.parent}
                </td>
              </tr>
              {parent.child.length &&
                parent.child.map((child) => (
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 pl-20">
                      {child.Name}
                    </td>
                    <TableData title={child} />
                  </tr>
                ))}
            </tbody>
          ))}
      </table>
    </Suspense>
  );
};

export default TitleFormTable;
