import { Legend } from "@headlessui/react";
import React from "react";
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
import {
  barSize,
  bluePurple,
  chartMarginLeft,
  chartMarginRight,
  gold,
  green,
  orange,
} from "../constants/constants";
import { getChartWindowStrs, shortenUnitStr } from "../utils/funcs";
import { ChartDescData, ChartTitle } from "../types/types";

interface Props {
  chartTitle: ChartTitle;
  data: any[] | undefined;
  chartDescData: ChartDescData[];
  unitStr: string;
}

const Chart = (props: Props) => {
  const { chartTitle, data, chartDescData, unitStr } = props;
  console.log("受け取ったデータ: ", data);

  // 単位をつけるフォーマッタ関数
  const formatYAxis = (tickItem: number, index: number): string => {
    return shortenUnitStr(unitStr, tickItem);
  };

  // %表示する際のフォーマッタ
  const formatRate = (tickItem: number): string => {
    return `${tickItem}%`;
  };

  return (
    <div className="mb-10 xl:w-[600px] xl:ml-[10%]">
      <div className="flex justify-center">
        <ResponsiveContainer minWidth={300} width="100%" height={250}>
          <ComposedChart
            data={data}
            margin={{ left: chartMarginLeft, right: chartMarginRight }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" tickFormatter={formatYAxis} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatRate}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "sales")
                  return getChartWindowStrs("売上高", value, unitStr);
                if (name === "operatingProfit")
                  return getChartWindowStrs("営業利益", value, unitStr);
                if (name === "operatingProfitRatio")
                  return [`${value}%`, "売上高営業利益率"];
                if (name === "capitalSum")
                  return getChartWindowStrs("資本合計", value, unitStr);
                if (name === "netAssets")
                  return getChartWindowStrs("純資産", value, unitStr);
                if (name === "liabilities")
                  return getChartWindowStrs("負債", value, unitStr);
                if (name === "ownedCapitalRatio")
                  return [`${value}%`, "自己資本比率"];
                if (name === "operatingCf")
                  return getChartWindowStrs(
                    "営業キャッシュフロー",
                    value,
                    unitStr
                  );
                if (name === "investingCf")
                  return getChartWindowStrs(
                    "投資キャッシュフロー",
                    value,
                    unitStr
                  );

                if (name === "financingCf")
                  return getChartWindowStrs(
                    "財務キャッシュフロー",
                    value,
                    unitStr
                  );

                if (name === "freeCf")
                  return getChartWindowStrs(
                    "フリーキャッシュフロー",
                    value,
                    unitStr
                  );
                return [value, name];
              }}
            />
            <Legend />
            {chartTitle === "SalesProfit" && (
              <>
                <Bar
                  dataKey="sales"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  dataKey="operatingProfit"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Line
                  type="linear"
                  dataKey="operatingProfitRatio"
                  yAxisId="right"
                  stroke={orange}
                />
              </>
            )}
            {chartTitle === "Capital" && (
              <>
                <Bar
                  dataKey="capitalSum"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  dataKey="netAssets"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  dataKey="liabilities"
                  fill={gold}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Line
                  type="linear"
                  dataKey="ownedCapitalRatio"
                  yAxisId="right"
                  stroke={orange}
                />
              </>
            )}
            {chartTitle === "CashFlow" && (
              <>
                <Bar
                  dataKey="operatingCf"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  dataKey="investingCf"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  dataKey="financingCf"
                  fill={gold}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  dataKey="freeCf"
                  fill={orange}
                  yAxisId="left"
                  barSize={barSize}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={`min-[500px]:flex justify-center min-w-[300px]`}>
        {chartDescData.map((data) => (
          <div
            className={
              data.isLast
                ? "flex justify-center"
                : "flex justify-center min-[500px]:mr-4"
            }
          >
            <div
              className={
                data.isLine
                  ? `w-[60px] min-[500px]:w-[40px] h-[2px] bg-[${data.color}] mr-2 self-center`
                  : `w-[60px] min-[500px]:w-[40px] bg-[${data.color}] my-1 mr-2`
              }
            ></div>
            <div className="w-[40%] min-[500px]:w-[100%] ml-4 min-[500px]:ml-0">
              {data.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
