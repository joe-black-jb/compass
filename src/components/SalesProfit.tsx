import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Fundamental } from "../types/types";
import { Legend } from "@headlessui/react";
import { getPeriodYear } from "../utils/funcs";
import { bluePurple, green, orange } from "../constants/constants";

interface Props {
  fundamentals: Fundamental[];
  unitStr: string;
}

const SalesProfit = (props: Props) => {
  const { fundamentals, unitStr } = props;

  const salesProfitWidth = 550;

  // 単位をつけるフォーマッタ関数
  const formatYAxis = (tickItem: number, index: number): string => {
    const tickItemStr = tickItem.toLocaleString();
    if (tickItem >= 1000000) {
      // return `${tickItemStr / 10000}万`; // 10000で割り万単位にする
      return tickItemStr;
    }
    return tickItemStr;
  };

  // TODO: 少数第一位まで表示

  // 営業利益率のフォーマッタ
  const formatProfitRate = (tickItem: number): string => {
    return `${tickItem.toFixed(1)}%`; // パーセント表示
  };

  // 綺麗にグラフが描けるように加工
  const sales = fundamentals.map((fundamental) => {
    const operatingProfitRatio = Math.floor(
      (fundamental.operating_profit / fundamental.sales) * 100
    );

    const periodStartYear = getPeriodYear(fundamental.period_start);
    return {
      period: periodStartYear,
      sales: fundamental.sales,
      operatingProfit: fundamental.operating_profit,
      operatingProfitRatio: operatingProfitRatio,
    };
  });

  return (
    <div className="ml-8 xl:ml-72 xl:mt-16 mb-10">
      {unitStr && (
        <div className="w-[90%] min-w-[300px] mb-4 text-gray-600 flex justify-end">
          <div>(単位：{unitStr})</div>
        </div>
      )}
      <div className="flex justify-center">
        <ResponsiveContainer minWidth={300} width="80%" height={250}>
          <ComposedChart data={sales} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" tickFormatter={formatYAxis} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatProfitRate}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "sales") return [value.toLocaleString(), "売上高"];
                if (name === "operatingProfit")
                  return [value.toLocaleString(), "営業利益"];
                if (name === "operatingProfitRatio")
                  return [`${value}%`, "売上高営業利益率"];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill={bluePurple} yAxisId="left" />
            <Bar dataKey="operatingProfit" fill={green} yAxisId="left" />
            <Line
              type="linear"
              dataKey="operatingProfitRatio"
              yAxisId="right"
              stroke={orange}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={`flex justify-center w-[90%] min-w-[300px]`}>
        <div className="flex justify-center mr-4">
          <div className={`w-[30px] bg-[#8884d8] my-1 mr-2`}></div>
          <div>売上高</div>
        </div>
        <div className="flex justify-center mr-4">
          <div className={`w-[30px] bg-[#82ca9d] my-1 mr-2`}></div>
          <div>営業利益</div>
        </div>
        <div className="flex justify-center">
          <div className={`w-[30px] h-[2px] bg-[#FF8042] my-[10px] mr-2`}></div>
          <div>売上高営業利益率</div>
        </div>
      </div>
    </div>
  );
};

export default SalesProfit;
