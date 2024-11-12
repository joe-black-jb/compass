import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import {
  noDataChartMarginLeft,
  noDataChartMarginRight,
} from "../constants/constants";

interface Props {
  noData?: boolean;
}

const ChartSkelton = (props: Props) => {
  const { noData = false } = props;
  const dummyData = [
    {
      name: "-",
      data1: 0,
      data2: 0,
      data3: 0,
    },
    {
      name: "-",
      data1: 0,
      data2: 0,
      data3: 0,
    },
    {
      name: "-",
      data1: 0,
      data2: 0,
      data3: 0,
    },
  ];
  return (
    <div className="mb-10 relative">
      <div className="flex justify-center animate-pulse">
        <ResponsiveContainer minWidth={350} width="100%" height={250}>
          <ComposedChart
            data={dummyData}
            margin={{
              left: noDataChartMarginLeft,
              right: noDataChartMarginRight,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <>
              <Bar dataKey="data1" />
              <Bar dataKey="data2" />
              <Bar dataKey="data3" />
            </>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {noData && (
        <div className="absolute top-0 w-full h-full flex justify-center items-center text-4xl text-gray-200">
          No Data
        </div>
      )}
    </div>
  );
};

export default ChartSkelton;
