import {
  PlJson,
  PlSummaryHeightClass,
  ReportData,
  TitleData,
} from "../types/types";
import { getHeightClass, getRatio } from "../utils/funcs";
import SummaryTitleTexts from "./SummaryTitleTexts";
import HiddenTitle from "./HiddenTitle";
import SummaryTitle from "./SummaryTitle";
import DisclosureSummary from "./DisclosureSummary";

interface Props {
  reportData: ReportData;
  periodStart?: string;
  periodEnd?: string;
}
const PlSummary = (props: Props) => {
  const { reportData, periodStart, periodEnd } = props;
  const { data } = reportData;

  const summary: PlJson = JSON.parse(data);

  const minRatio = 10;
  const singleLineRatio = 15;
  const operatingLossMinRatio = -10;

  const hiddenTitles: TitleData[] = [];

  // 営業収益、営業費用が計上されているかどうか
  const hasOperatingRevenueAndCost =
    summary.has_operating_revenue && summary.has_operating_cost;

  const plSummaryHeightClass: PlSummaryHeightClass = {
    costOfGoodsSoldHeightClass: "",
    sgAndAHeightClass: "",
    salesHeightClass: "",
    operatingProfitHeightClass: "",
    operatingRevenueHeightClass: "",
    operatingCostHeightClass: "",
  };

  // 項目ごとの割合計算
  // 営業利益 (マイナスになる場合もあるので先に計算)
  const operatingProfit = summary.operating_profit.current;
  // console.log("【PL】営業利益: ", operatingProfit);

  // 営業収益
  let operatingRevenue: number = 0;
  if (summary.has_operating_revenue) {
    operatingRevenue = summary.operating_revenue.current;
  }

  // 売上原価
  const costOfGoodsSold = summary.cost_of_goods_sold.current;
  // 販管費
  const sgAndA = summary.sg_and_a.current;

  // 営業費用
  const operatingCost = summary.operating_cost.current;

  let left = 0;
  if (hasOperatingRevenueAndCost) {
    left = operatingCost;
  } else {
    left = costOfGoodsSold + sgAndA;
  }

  // 営業利益がプラスの場合、借方に加算
  if (operatingProfit >= 0) {
    left += operatingProfit;
  }

  // 売上原価の割合
  const costOfGoodsSoldRatio = getRatio(costOfGoodsSold, left);
  plSummaryHeightClass.costOfGoodsSoldHeightClass =
    getHeightClass(costOfGoodsSoldRatio);
  if (costOfGoodsSoldRatio < minRatio && !hasOperatingRevenueAndCost) {
    hiddenTitles.push({
      titleName: "売上原価",
      value: costOfGoodsSold,
      ratio: costOfGoodsSoldRatio,
      color: "red",
    });
  }
  // 販管費の割合
  let sgAndARatio = getRatio(sgAndA, left);
  plSummaryHeightClass.sgAndAHeightClass = getHeightClass(sgAndARatio);
  if (sgAndARatio < minRatio && !hasOperatingRevenueAndCost) {
    hiddenTitles.push({
      titleName: "販管費",
      value: sgAndA,
      ratio: sgAndARatio,
      color: "blue",
    });
  }

  // 売上高
  const sales = summary.sales.current;
  const salesRatio = getRatio(sales, left);

  plSummaryHeightClass.salesHeightClass = getHeightClass(salesRatio);
  if (salesRatio < minRatio && !hasOperatingRevenueAndCost) {
    hiddenTitles.push({
      titleName: "売上高",
      value: sales,
      ratio: salesRatio,
      color: "gray",
    });
  }

  let right = 0;
  if (hasOperatingRevenueAndCost) {
    right = operatingRevenue;
    if (operatingProfit < 0) {
      right -= operatingProfit;
    }
  } else {
    right = sales;
    // 営業利益がマイナスの場合、符号を反転させ、貸方に加算
    if (operatingProfit < 0) {
      right += -operatingProfit;
    }
  }

  // 営業利益の割合
  let operatingProfitRatio: number;
  if (operatingProfit >= 0) {
    operatingProfitRatio = getRatio(operatingProfit, left);
  } else {
    operatingProfitRatio = getRatio(operatingProfit, right);
  }
  if (operatingProfit >= 0 && operatingProfitRatio < minRatio) {
    hiddenTitles.push({
      titleName: "営業利益",
      value: operatingProfit,
      ratio: operatingProfitRatio,
      color: "green",
    });
  }

  // 営業収益の割合
  let operatingRevenueRatio: number;
  if (operatingRevenue >= 0) {
    operatingRevenueRatio = getRatio(operatingRevenue, left);
  } else {
    operatingRevenueRatio = getRatio(operatingRevenue, right);
  }
  plSummaryHeightClass.operatingRevenueHeightClass = getHeightClass(
    operatingRevenueRatio
  );
  if (
    summary.has_operating_revenue &&
    summary.has_operating_cost &&
    operatingRevenue >= 0 &&
    operatingRevenueRatio < minRatio
  ) {
    hiddenTitles.push({
      titleName: "営業収益",
      value: operatingRevenue,
      ratio: operatingRevenueRatio,
      color: "green",
    });
  }

  if (operatingProfit < 0) {
    // 営業利益率の絶対値
    // マイナスの場合符号を反転させる
    const operatingProfitRatioAbs = -operatingProfitRatio;
    if (operatingProfit < 0 && operatingProfitRatioAbs < minRatio) {
      hiddenTitles.push({
        titleName: "営業損失",
        value: operatingProfit,
        ratio: operatingProfitRatio,
        color: "purple",
      });
    }
  }

  // 営業費用の割合
  let operatingCostRatio = 0;
  if (hasOperatingRevenueAndCost) {
    operatingCostRatio = getRatio(operatingCost, left);
  }
  plSummaryHeightClass.operatingCostHeightClass =
    getHeightClass(operatingCostRatio);

  let salesClass =
    "bg-gray-100 rounded-tr-2xl border-y-2 border-r-2 border-gray-600 text-center flex items-center justify-center";

  let operatingCostClass =
    "bg-red-100 border-2 border-gray-600 rounded-tl-2xl text-center flex items-center justify-center";

  // 100 - 借方の合計値
  let leftExtra = 0;
  if (hasOperatingRevenueAndCost) {
    // 営業収益がある場合、営業収益と営業利益を利用
    leftExtra = 100 - operatingCostRatio;
  } else {
    // 営業収益がない場合、売上高と販管費を利用
    leftExtra = 100 - (costOfGoodsSoldRatio + sgAndARatio);
  }

  // 100 - 貸方の合計値
  let rightExtra = 0;

  if (hasOperatingRevenueAndCost) {
    // 営業利益がプラスの場合、借方に記載
    // 営業利益がマイナスの場合、貸方に記載
    if (operatingProfit >= 0) {
    } else {
      // 営業利益がマイナスの場合、符号を反転してプラスの値で height を設定する
      plSummaryHeightClass.operatingProfitHeightClass = getHeightClass(
        -operatingProfitRatio
      );
      operatingCostClass += " rounded-bl-2xl";
    }
  } else {
    rightExtra = 100 - salesRatio;

    if (operatingProfit >= 0) {
      leftExtra -= operatingProfitRatio;
      plSummaryHeightClass.operatingProfitHeightClass = getHeightClass(
        operatingProfitRatio + leftExtra
      );
      // className を追加
      salesClass += " rounded-br-2xl";
    } else {
      rightExtra -= operatingProfitRatio;
      plSummaryHeightClass.operatingProfitHeightClass = getHeightClass(
        operatingProfitRatio + rightExtra
      );
      // 販管費にleftExtraを足す
      plSummaryHeightClass.sgAndAHeightClass = getHeightClass(
        sgAndARatio + leftExtra
      );
    }
  }

  const SummaryTitleEl = (): JSX.Element => {
    return (
      <SummaryTitle
        title="損益計算書"
        periodStart={periodStart}
        periodEnd={periodEnd}
      />
    );
  };

  const MainEl = (): JSX.Element => {
    return (
      <>
        <div className="mt-4">(単位：{summary.unit_string})</div>
        <div className="flex justify-center md:justify-start mt-2 w-full">
          {/* 借方 */}
          <div className="h-[400px] w-52">
            {hasOperatingRevenueAndCost ? (
              <>
                {/* 営業費用 */}
                <div
                  className={operatingCostClass}
                  style={{
                    height: plSummaryHeightClass.operatingCostHeightClass,
                  }}
                >
                  <div
                    className={operatingCostRatio < minRatio ? "hidden" : ""}
                  >
                    <div>営業費用</div>
                    <div>{summary.operating_cost.current.toLocaleString()}</div>
                    <div>({operatingCostRatio}%)</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 売上原価 */}
                <div
                  className="bg-red-100 border-2 border-gray-600 rounded-tl-2xl text-center flex items-center justify-center"
                  style={{
                    height: plSummaryHeightClass.costOfGoodsSoldHeightClass,
                  }}
                >
                  <div
                    className={costOfGoodsSoldRatio < minRatio ? "hidden" : ""}
                  >
                    {costOfGoodsSoldRatio > singleLineRatio ? (
                      <SummaryTitleTexts
                        titleName="売上原価"
                        valueStr={summary.cost_of_goods_sold.current.toLocaleString()}
                        ratio={costOfGoodsSoldRatio}
                        singleLine={false}
                      />
                    ) : (
                      <SummaryTitleTexts
                        titleName="売上原価"
                        valueStr={summary.cost_of_goods_sold.current.toLocaleString()}
                        ratio={costOfGoodsSoldRatio}
                        singleLine={true}
                      />
                    )}
                  </div>
                </div>
                {/* 販管費 */}
                <div
                  className={`bg-blue-100 border-x-2 border-b-2 border-gray-600 text-center flex items-center justify-center ${
                    operatingProfit < 0 && "rounded-bl-2xl"
                  } `}
                  style={{
                    height: plSummaryHeightClass.sgAndAHeightClass,
                  }}
                >
                  <div
                    className={
                      getRatio(sgAndA, left) < minRatio ? "hidden" : ""
                    }
                  >
                    {sgAndARatio > singleLineRatio ? (
                      <SummaryTitleTexts
                        titleName="販管費"
                        valueStr={summary.sg_and_a.current.toLocaleString()}
                        ratio={sgAndARatio}
                        singleLine={false}
                      />
                    ) : (
                      <SummaryTitleTexts
                        titleName="販管費"
                        valueStr={summary.sg_and_a.current.toLocaleString()}
                        ratio={sgAndARatio}
                        singleLine={true}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
            {/* 営業利益 */}
            {operatingProfit >= 0 && (
              <div
                className="bg-green-100 relative rounded-bl-2xl border-x-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
                style={{
                  height: plSummaryHeightClass.operatingProfitHeightClass,
                }}
              >
                <div
                  className={operatingProfitRatio < minRatio ? "hidden" : ""}
                >
                  {operatingProfitRatio > singleLineRatio ? (
                    <SummaryTitleTexts
                      titleName="営業利益"
                      valueStr={summary.operating_profit.current.toLocaleString()}
                      ratio={operatingProfitRatio}
                      singleLine={false}
                    />
                  ) : (
                    <SummaryTitleTexts
                      titleName="営業利益"
                      valueStr={summary.operating_profit.current.toLocaleString()}
                      ratio={operatingProfitRatio}
                      singleLine={true}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {/* 貸方 */}
          <div className="h-[400px] w-52">
            {hasOperatingRevenueAndCost ? (
              <>
                {/* 営業収益 */}
                <div
                  className={salesClass}
                  style={{
                    height: plSummaryHeightClass.operatingRevenueHeightClass,
                  }}
                >
                  <div
                    className={operatingRevenueRatio < minRatio ? "hidden" : ""}
                  >
                    <div>営業収益</div>
                    <div>
                      {summary.operating_revenue.current.toLocaleString()}
                    </div>
                    <div>({operatingRevenueRatio}%)</div>
                  </div>
                </div>
              </>
            ) : (
              // {/* 売上高 */}
              <div
                className={salesClass}
                style={{
                  height: plSummaryHeightClass.salesHeightClass,
                }}
              >
                <div className={salesRatio < minRatio ? "hidden" : ""}>
                  <div>売上高</div>
                  <div>{summary.sales.current.toLocaleString()}</div>
                  <div>({salesRatio}%)</div>
                </div>
              </div>
            )}
            {/* 営業損失 */}
            {operatingProfitRatio < 0 && (
              <div
                className="bg-purple-100 rounded-br-2xl border-r-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
                style={{
                  height: plSummaryHeightClass.operatingProfitHeightClass,
                }}
              >
                <div
                  className={
                    operatingProfitRatio > operatingLossMinRatio ? "hidden" : ""
                  }
                >
                  {operatingProfitRatio > singleLineRatio ? (
                    <SummaryTitleTexts
                      titleName="営業損失"
                      valueStr={summary.operating_profit.current.toLocaleString()}
                      ratio={operatingProfitRatio}
                      singleLine={false}
                    />
                  ) : (
                    <SummaryTitleTexts
                      titleName="営業損失"
                      valueStr={summary.operating_profit.current.toLocaleString()}
                      ratio={operatingProfitRatio}
                      singleLine={true}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {hiddenTitles && hiddenTitles.length > 0 && (
          <div className="flex justify-start">
            <div>
              <div className="mt-4">【非表示の項目】</div>
              <div>
                {hiddenTitles.map((titleData) => (
                  <HiddenTitle
                    key={titleData.titleName}
                    titleData={titleData}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // console.log("営業収益の割合: ", operatingRevenueRatio);
  // console.log("営業費用の割合: ", operatingCostRatio);

  return (
    <div className="mb-8 sm:ml-10 full sm:w-[240px] lg:w-[350px] mx-auto sm:mx-0">
      <DisclosureSummary SummaryTitle={SummaryTitleEl()} Main={MainEl()} />
    </div>
  );
};

export default PlSummary;
