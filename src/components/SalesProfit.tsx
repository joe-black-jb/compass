import { Fundamental } from "../types/types";
import { getPeriodYear } from "../utils/funcs";
import Chart from "./Chart";

interface Props {
  fundamentals: Fundamental[];
  unitStr: string;
}

const SalesProfit = (props: Props) => {
  const { fundamentals, unitStr } = props;

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

  return <Chart chartTitle="SalesProfit" data={data} unitStr={unitStr} />;
};

export default SalesProfit;
