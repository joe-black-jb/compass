import { CfJson, ChartDescData, ReportData } from "../types/types";
import { bluePurple, gold, green, orange } from "../constants/constants";
import Chart from "./Chart";

interface Props {
  reportDataList: ReportData[];
  unitStr: string;
}

const CashFlow = (props: Props) => {
  const { reportDataList, unitStr } = props;
  const chartDescData: ChartDescData[] = [
    {
      title: "営業CF",
      color: bluePurple,
      isLine: false,
      isLast: false,
    },
    {
      title: "投資CF",
      color: green,
      isLine: false,
      isLast: false,
    },
    {
      title: "財務CF",
      color: gold,
      isLine: false,
      isLast: false,
    },
    {
      title: "フリーCF",
      color: orange,
      isLine: false,
      isLast: true,
    },
  ];

  const data = reportDataList.map((report) => {
    const { data } = report;
    const cf: CfJson = JSON.parse(data);
    const operatingCf = cf.operating_cf.current;
    const investingCf = cf.investing_cf.current;
    const financingCf = cf.financing_cf.current;
    // フリーCF = 営業CF + 投資CF
    const freeCf = operatingCf + investingCf;

    return {
      period: cf.period_start,
      operatingCf,
      investingCf,
      financingCf,
      freeCf,
    };
  });

  return (
    <Chart
      chartTitle="CashFlow"
      data={data}
      chartDescData={chartDescData}
      unitStr={unitStr}
    />
  );
};

export default CashFlow;
