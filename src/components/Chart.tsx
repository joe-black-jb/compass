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
  CAPITAL_SUM,
  chartMarginLeft,
  chartMarginRight,
  FINANCING_CASH_FLOW,
  FREE_CASH_FLOW,
  gold,
  green,
  INVESTING_CASH_FLOW,
  LIABILITIES,
  NET_ASSETS,
  OPERATING_CASH_FLOW,
  OPERATING_PROFIT,
  OPERATING_PROFIT_RATIO,
  orange,
  OWNED_CAPITAL_RATIO,
  SALES,
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
    <div className="mb-10">
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
              contentStyle={{
                width: "fit-content",
                height: "fit-content",
                fontSize: 12,
              }}
              position={{ y: 100 }}
              formatter={(value, name) => {
                if (name === SALES)
                  return getChartWindowStrs(SALES, value, unitStr);
                if (name === OPERATING_PROFIT)
                  return getChartWindowStrs(OPERATING_PROFIT, value, unitStr);
                if (name === OPERATING_PROFIT_RATIO)
                  return [`${value}%`, OPERATING_PROFIT_RATIO];
                if (name === CAPITAL_SUM)
                  return getChartWindowStrs(CAPITAL_SUM, value, unitStr);
                if (name === NET_ASSETS)
                  return getChartWindowStrs(NET_ASSETS, value, unitStr);
                if (name === LIABILITIES)
                  return getChartWindowStrs(LIABILITIES, value, unitStr);
                if (name === OWNED_CAPITAL_RATIO)
                  return [`${value}%`, OWNED_CAPITAL_RATIO];
                if (name === OPERATING_CASH_FLOW)
                  return getChartWindowStrs(
                    OPERATING_CASH_FLOW,
                    value,
                    unitStr
                  );
                if (name === INVESTING_CASH_FLOW)
                  return getChartWindowStrs(
                    INVESTING_CASH_FLOW,
                    value,
                    unitStr
                  );

                if (name === FINANCING_CASH_FLOW)
                  return getChartWindowStrs(
                    FINANCING_CASH_FLOW,
                    value,
                    unitStr
                  );

                if (name === FREE_CASH_FLOW)
                  return getChartWindowStrs(FREE_CASH_FLOW, value, unitStr);
                return [value, name];
              }}
            />
            <Legend />
            {chartTitle === "SalesProfit" && (
              <>
                <Bar
                  name={SALES}
                  dataKey="sales"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name={OPERATING_PROFIT}
                  dataKey="operatingProfit"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Line
                  name={OPERATING_PROFIT_RATIO}
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
                  name={CAPITAL_SUM}
                  dataKey="capitalSum"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name={NET_ASSETS}
                  dataKey="netAssets"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name={LIABILITIES}
                  dataKey="liabilities"
                  fill={gold}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Line
                  name={OWNED_CAPITAL_RATIO}
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
                  name={OPERATING_CASH_FLOW}
                  dataKey="operatingCf"
                  fill={bluePurple}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name={INVESTING_CASH_FLOW}
                  dataKey="investingCf"
                  fill={green}
                  yAxisId="left"
                  barSize={barSize}
                />
                <Bar
                  name={FINANCING_CASH_FLOW}
                  dataKey="financingCf"
                  fill={gold}
                  yAxisId="left"
                  barSize={barSize}
                />
                {/* フリーCF (棒グラフ) */}
                {/* <Bar
                  name={FREE_CASH_FLOW}
                  dataKey="freeCf"
                  fill={orange}
                  yAxisId="left"
                  barSize={barSize}
                /> */}
                {/* フリーCF (折れ線グラフ) */}
                <Line
                  name={FREE_CASH_FLOW}
                  type="linear"
                  dataKey="freeCf"
                  yAxisId="left"
                  stroke={orange}
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
