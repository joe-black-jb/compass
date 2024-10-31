import { useEffect, useState } from "react";
import {
  PlJson,
  PlSummaryHeightClass,
  ReportData,
  TitleData,
} from "../types/types";
import { getHeightClass, getRatio } from "../utils/funcs";
import SummaryTitleTexts from "./SummaryTitleTexts";
import HiddenTitle from "./HiddenTitle";

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

  const plSummaryHeightClass: PlSummaryHeightClass = {
    costOfGoodsSoldHeightClass: "",
    sgAndAHeightClass: "",
    salesHeightClass: "",
    operatingProfitHeightClass: "",
  };

  // 項目ごとの割合計算
  // 営業利益 (マイナスになる場合もあるので先に計算)
  const operatingProfit = summary.operating_profit.current;
  // console.log("【PL】営業利益: ", operatingProfit);

  // 売上原価
  const costOfGoodsSold = summary.cost_of_goods_sold.current;
  // 販管費
  const sgAndA = summary.sg_and_a.current;

  let left = costOfGoodsSold + sgAndA;
  // 営業利益がプラスの場合、借方に加算
  if (operatingProfit >= 0) {
    left += operatingProfit;
  }

  // 売上原価の割合
  const costOfGoodsSoldRatio = getRatio(costOfGoodsSold, left);
  plSummaryHeightClass.costOfGoodsSoldHeightClass =
    getHeightClass(costOfGoodsSoldRatio);
  if (costOfGoodsSoldRatio < minRatio) {
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
  if (sgAndARatio < minRatio) {
    hiddenTitles.push({
      titleName: "販管費",
      value: sgAndA,
      ratio: sgAndARatio,
      color: "blue",
    });
  }

  // 売上高
  const sales = summary.sales.current;
  // 売上高の割合
  const salesRatio = getRatio(sales, left);
  plSummaryHeightClass.salesHeightClass = getHeightClass(salesRatio);
  if (salesRatio < minRatio) {
    hiddenTitles.push({
      titleName: "売上高",
      value: sales,
      ratio: salesRatio,
      color: "gray",
    });
  }

  let right = sales;
  // 営業利益がマイナスの場合、貸方に加算
  if (operatingProfit < 0) {
    right += operatingProfit;
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

  if (operatingProfit < 0) {
    // 営業利益率の絶対値
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

  let salesClass =
    "bg-gray-100 rounded-tr-2xl border-y-2 border-r-2 border-gray-600 text-center flex items-center justify-center";

  // 100 - 借方の合計値
  let leftExtra = 100 - (costOfGoodsSoldRatio + sgAndARatio);
  // 100 - 貸方の合計値
  let rightExtra = 100 - salesRatio;
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

  return (
    <div className="mb-20 sm:ml-10 full sm:w-[240px] lg:w-[350px] mx-auto sm:mx-0">
      <div className="bg-green-300 font-bold rounded-xl py-2 px-2">
        <div className="text-center">損益計算書</div>
        {periodStart && periodEnd && (
          <div className="text-center">
            ({periodStart} ~ {periodEnd})
          </div>
        )}
      </div>
      <div className="mt-4">(単位：{summary.unit_string})</div>
      <div className="flex justify-center md:justify-start mt-2 w-full">
        {/* 借方 */}
        <div className="h-[500px] w-52">
          {/* 売上原価 */}
          <div
            className="bg-red-100 border-2 border-gray-600 rounded-tl-2xl text-center flex items-center justify-center"
            style={{ height: plSummaryHeightClass.costOfGoodsSoldHeightClass }}
          >
            <div className={costOfGoodsSoldRatio < minRatio ? "hidden" : ""}>
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
            style={{ height: plSummaryHeightClass.sgAndAHeightClass }}
          >
            <div className={getRatio(sgAndA, left) < minRatio ? "hidden" : ""}>
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
          {/* 営業利益 */}
          {operatingProfit >= 0 && (
            <div
              className="bg-green-100 relative rounded-bl-2xl border-x-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
              style={{
                height: plSummaryHeightClass.operatingProfitHeightClass,
              }}
            >
              <div className={operatingProfitRatio < minRatio ? "hidden" : ""}>
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
        <div className="h-[500px] w-52">
          {/* 売上高 */}
          <div
            className={salesClass}
            style={{ height: plSummaryHeightClass.salesHeightClass }}
          >
            <div className={salesRatio < minRatio ? "hidden" : ""}>
              <div>売上高</div>
              <div>{summary.sales.current.toLocaleString()}</div>
              <div>({salesRatio}%)</div>
            </div>
          </div>
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
                <HiddenTitle key={titleData.titleName} titleData={titleData} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlSummary;
