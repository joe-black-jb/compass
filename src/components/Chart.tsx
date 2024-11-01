import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
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
import { ChartTitle } from "../types/types";

interface Props {
  chartTitle: ChartTitle;
  data: any[] | undefined;
  unitStr: string;
}

const Chart = (props: Props) => {
  const { chartTitle, data, unitStr } = props;

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
        <ResponsiveContainer minWidth={350} width="100%" height={250}>
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
                  name="売上高"
                  dataKey="sales"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name="営業利益"
                  dataKey="operatingProfit"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Line
                  name="売上高営業利益率"
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
                  name="資本合計"
                  dataKey="capitalSum"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name="純資産"
                  dataKey="netAssets"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name="負債"
                  dataKey="liabilities"
                  fill={gold}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Line
                  name="自己資本比率"
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
                  name="営業CF"
                  dataKey="operatingCf"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name="投資CF"
                  dataKey="investingCf"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name="財務CF"
                  dataKey="financingCf"
                  fill={gold}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name="フリーCF"
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
    </div>
  );
};

export default Chart;
