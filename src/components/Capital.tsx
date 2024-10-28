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
import { bluePurple, gold, green, orange } from "../constants/constants";

interface Props {
  fundamentals: Fundamental[];
  unitStr: string;
}

const Capital = (props: Props) => {
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

  // 営業利益率のフォーマッタ
  const formatProfitRate = (tickItem: number): string => {
    return `${tickItem.toFixed(1)}%`; // パーセント表示
  };

  // 綺麗にグラフが描けるように加工
  const sales = fundamentals.map((fundamental) => {
    // 自己資本比率
    const capitalSum = fundamental.liabilities + fundamental.net_assets;
    const ownedCapitalRatio = Math.floor(
      (fundamental.net_assets / capitalSum) * 100
    );

    const periodStartYear = getPeriodYear(fundamental.period_start);
    return {
      period: periodStartYear,
      capitalSum,
      liabilities: fundamental.liabilities,
      netAssets: fundamental.net_assets,
      ownedCapitalRatio,
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
                if (name === "capitalSum")
                  return [value.toLocaleString(), "資本合計"];
                if (name === "netAssets")
                  return [value.toLocaleString(), "純資産"];
                if (name === "liabilities")
                  return [value.toLocaleString(), "負債"];
                if (name === "ownedCapitalRatio")
                  return [`${value}%`, "自己資本比率"];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="capitalSum" fill={bluePurple} yAxisId="left" />
            <Bar dataKey="netAssets" fill={green} yAxisId="left" />
            <Bar dataKey="liabilities" fill={gold} yAxisId="left" />
            <Line
              type="linear"
              dataKey="ownedCapitalRatio"
              yAxisId="right"
              stroke={orange}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className={`flex justify-center w-[90%] min-w-[300px]`}>
        <div className="flex justify-center mr-4">
          <div className={`w-[30px] bg-[${bluePurple}] my-1 mr-2`}></div>
          <div>資本合計</div>
        </div>
        <div className="flex justify-center mr-4">
          <div className={`w-[30px] bg-[#82ca9d] my-1 mr-2`}></div>
          <div>純資産</div>
        </div>
        <div className="flex justify-center mr-4">
          <div className={`w-[30px] bg-[#ffd700] my-1 mr-2`}></div>
          <div>負債</div>
        </div>
        <div className="flex justify-center">
          <div
            className={`w-[30px] h-[2px] bg-[${orange}] my-[10px] mr-2`}
          ></div>
          <div>自己資本比率</div>
        </div>
      </div>
    </div>
  );
};

export default Capital;
