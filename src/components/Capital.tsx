import { ChartDescData, Fundamental } from "../types/types";
import { getPeriodYear } from "../utils/funcs";
import { bluePurple, gold, green, orange } from "../constants/constants";
import Chart from "./Chart";

interface Props {
  fundamentals: Fundamental[];
  unitStr: string;
}

const Capital = (props: Props) => {
  const { fundamentals, unitStr } = props;
  const chartDescData: ChartDescData[] = [
    {
      title: "資本合計",
      color: bluePurple,
      isLine: false,
      isLast: false,
    },
    {
      title: "純資産",
      color: green,
      isLine: false,
      isLast: false,
    },
    {
      title: "負債",
      color: gold,
      isLine: false,
      isLast: false,
    },
    {
      title: "自己資本比率",
      color: orange,
      isLine: true,
      isLast: true,
    },
  ];

  // 綺麗にグラフが描けるように加工
  const data = fundamentals.map((fundamental) => {
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
    <Chart
      chartTitle="Capital"
      data={data}
      chartDescData={chartDescData}
      unitStr={unitStr}
    />
  );
};

export default Capital;
