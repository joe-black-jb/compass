import { ChartDescData, Fundamental } from "../types/types";
import { getPeriodYear } from "../utils/funcs";
import { bluePurple, green, orange } from "../constants/constants";
import Chart from "./Chart";

interface Props {
  fundamentals: Fundamental[];
  unitStr: string;
}

const SalesProfit = (props: Props) => {
  const { fundamentals, unitStr } = props;
  const chartDescData: ChartDescData[] = [
    {
      title: "売上高",
      color: bluePurple,
      isLine: false,
      isLast: false,
    },
    {
      title: "営業利益",
      color: green,
      isLine: false,
      isLast: false,
    },
    {
      title: "売上高営業利益率",
      color: orange,
      isLine: true,
      isLast: true,
    },
  ];

  // 綺麗にグラフが描けるように加工
  const data = fundamentals.map((fundamental) => {
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
    <Chart
      chartTitle="SalesProfit"
      data={data}
      chartDescData={chartDescData}
      unitStr={unitStr}
    />
  );
};

export default SalesProfit;
