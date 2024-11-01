import { CfJson, ReportData } from "../types/types";
import Chart from "./Chart";

interface Props {
  reportDataList: ReportData[];
  unitStr: string;
}

const CashFlow = (props: Props) => {
  const { reportDataList, unitStr } = props;

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

  return <Chart chartTitle="CashFlow" data={data} unitStr={unitStr} />;
};

export default CashFlow;
