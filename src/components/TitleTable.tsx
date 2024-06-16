import React, { Suspense } from "react";
import { TitleFamily } from "../types/types";

interface Props {
  family: TitleFamily[];
  header: string;
}

const TitleTable = (props: Props) => {
  const { family, header } = props;
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
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {child.Value}
                    </td>
                  </tr>
                ))}
            </tbody>
          ))}
      </table>
    </Suspense>
  );
};

export default TitleTable;
