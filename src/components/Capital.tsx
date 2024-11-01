import { Fundamental } from "../types/types";
import { getPeriodYear } from "../utils/funcs";
import Chart from "./Chart";

interface Props {
  fundamentals: Fundamental[];
  unitStr: string;
}

const Capital = (props: Props) => {
  const { fundamentals, unitStr } = props;

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

  return <Chart chartTitle="Capital" data={data} unitStr={unitStr} />;
};

export default Capital;
