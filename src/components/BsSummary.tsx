import { useEffect, useState } from "react";
import { BsJson, BsSummaryHeightClass, TitleData } from "../types/types";
import { getHeightClass, getRatio } from "../utils/funcs";
import SummaryTitleTexts from "./SummaryTitleTexts";
import HiddenTitle from "./HiddenTitle";

interface Props {
  data: BsJson;
}
const BsSummary = (props: Props) => {
  const { data } = props;

  const minRatio = 10;
  const singleLineRatio = 15;

  const hiddenTitles: TitleData[] = [];

  const bsSummaryHeightClass: BsSummaryHeightClass = {
    currentAssetsHeightClass: "",
    tangibleAssetsHeightClass: "",
    intangibleAssetsHeightClass: "",
    investmentsAndOtherAssetsHeightClass: "",
    currentLiabilitiesHeightClass: "",
    fixedLiabilitiesHeightClass: "",
    netAssetsHeightClass: "",
  };

  // 項目ごとの割合計算
  // 流動資産
  const currentAssets = data.current_assets.current;
  // 有形固定資産
  const tangibleAssets = data.tangible_assets.current;
  // 無形固定資産
  const intangibleAssets = data.intangible_assets.current;
  // 投資その他の資産
  const investmentsAndOtherAssets = data.investments_and_other_assets.current;
  // 流動負債
  const currentLiabilities = data.current_liabilities.current;
  // 固定負債
  const fixedLiabilities = data.fixed_liabilities.current;
  // 純資産
  const netAssets = data.net_assets.current;

  const left =
    currentAssets +
    tangibleAssets +
    intangibleAssets +
    investmentsAndOtherAssets;

  const right = currentLiabilities + fixedLiabilities + netAssets;

  // console.log("left: ", left);
  // console.log("right: ", right);

  // 流動資産の割合
  const currentAssetsRatio = getRatio(currentAssets, left);
  bsSummaryHeightClass.currentAssetsHeightClass =
    getHeightClass(currentAssetsRatio);
  if (currentAssetsRatio < minRatio) {
    hiddenTitles.push({
      titleName: "流動資産",
      value: currentAssets,
      ratio: currentAssetsRatio,
      color: "red",
    });
  }
  // 有形固定資産の割合
  const tangibleAssetsRatio = getRatio(tangibleAssets, left);
  bsSummaryHeightClass.tangibleAssetsHeightClass =
    getHeightClass(tangibleAssetsRatio);
  if (tangibleAssetsRatio < minRatio) {
    hiddenTitles.push({
      titleName: "有形固定資産",
      value: tangibleAssets,
      ratio: tangibleAssetsRatio,
      color: "blue",
    });
  }
  // 無形固定資産の割合
  const intangibleAssetsRatio = getRatio(intangibleAssets, left);
  bsSummaryHeightClass.intangibleAssetsHeightClass = getHeightClass(
    intangibleAssetsRatio
  );
  if (intangibleAssetsRatio < minRatio) {
    hiddenTitles.push({
      titleName: "無形固定資産",
      value: intangibleAssets,
      ratio: intangibleAssetsRatio,
      color: "green",
    });
  }
  // 投資その他の資産の割合
  const investmentsAndOtherAssetsRatio = getRatio(
    investmentsAndOtherAssets,
    left
  );
  if (investmentsAndOtherAssetsRatio < minRatio) {
    hiddenTitles.push({
      titleName: "投資その他の資産",
      value: investmentsAndOtherAssets,
      ratio: investmentsAndOtherAssetsRatio,
      color: "yellow",
    });
  }

  // 100 - 借方の合計値
  const leftExtra =
    100 -
    (currentAssetsRatio +
      tangibleAssetsRatio +
      intangibleAssetsRatio +
      investmentsAndOtherAssetsRatio);
  // console.log("借方のあまり割合: ", leftExtra);
  // 投資その他の資産に余り分を加えて帳尻を合わせる
  bsSummaryHeightClass.investmentsAndOtherAssetsHeightClass = getHeightClass(
    investmentsAndOtherAssetsRatio + leftExtra
  );

  // 流動負債の割合
  const currentLiabilitiesRatio = getRatio(currentLiabilities, right);
  bsSummaryHeightClass.currentLiabilitiesHeightClass = getHeightClass(
    currentLiabilitiesRatio
  );
  if (currentLiabilitiesRatio < minRatio) {
    hiddenTitles.push({
      titleName: "流動負債",
      value: currentLiabilities,
      ratio: currentLiabilitiesRatio,
      color: "gray",
    });
  }
  // 固定負債の割合
  const fixedLiabilitiesRatio = getRatio(fixedLiabilities, right);
  bsSummaryHeightClass.fixedLiabilitiesHeightClass = getHeightClass(
    fixedLiabilitiesRatio
  );
  if (fixedLiabilitiesRatio < minRatio) {
    hiddenTitles.push({
      titleName: "固定負債",
      value: fixedLiabilities,
      ratio: fixedLiabilitiesRatio,
      color: "purple",
    });
  }
  // 純資産の割合
  const netAssetsRatio = getRatio(netAssets, right);
  if (netAssetsRatio < minRatio) {
    hiddenTitles.push({
      titleName: "純資産",
      value: netAssets,
      ratio: netAssetsRatio,
      color: "orange",
    });
  }

  const rightExtra =
    100 - (currentLiabilitiesRatio + fixedLiabilitiesRatio + netAssetsRatio);

  // 純資産に余り分を加えて帳尻を合わせる
  bsSummaryHeightClass.netAssetsHeightClass = getHeightClass(
    netAssetsRatio + rightExtra
  );

  // console.log("貸方のあまり割合: ", rightExtra);

  // console.log(
  //   "固定負債の割合: ",
  //   bsSummaryHeightClass.fixedLiabilitiesHeightClass
  // );
  // console.log(
  //   "投資その他の資産の割合: ",
  //   bsSummaryHeightClass.investmentsAndOtherAssetsHeightClass
  // );

  // TODO: 15% 以下の場合 1行で表示する
  // console.log("hiddenTitles: ", hiddenTitles);
  // console.log("固定負債比率: ", fixedLiabilitiesRatio);

  return (
    <div className="mb-20">
      <div className="mt-4">【B/S (単位：{data.unit_string})】</div>
      <div className="flex justify-center md:justify-start mt-2 w-full">
        {/* 借方 */}
        <div className="h-[500px] w-52">
          {/* 流動資産 */}
          <div
            className="bg-red-100 border-2 border-gray-600 rounded-tl-2xl text-center flex items-center justify-center"
            style={{ height: bsSummaryHeightClass.currentAssetsHeightClass }}
          >
            <div className={currentAssetsRatio < minRatio ? "hidden" : ""}>
              {currentAssetsRatio > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="流動資産"
                  valueStr={data.current_assets.current.toLocaleString()}
                  ratio={currentAssetsRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="流動資産"
                  valueStr={data.current_assets.current.toLocaleString()}
                  ratio={currentAssetsRatio}
                  singleLine={false}
                />
              )}
            </div>
          </div>
          {/* 有形固定資産 */}
          <div
            className="bg-blue-100 border-x-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
            style={{ height: bsSummaryHeightClass.tangibleAssetsHeightClass }}
          >
            <div className={tangibleAssetsRatio < minRatio ? "hidden" : ""}>
              {tangibleAssetsRatio > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="有形固定資産"
                  valueStr={data.tangible_assets.current.toLocaleString()}
                  ratio={tangibleAssetsRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="有形固定資産"
                  valueStr={data.tangible_assets.current.toLocaleString()}
                  ratio={tangibleAssetsRatio}
                  singleLine={true}
                />
              )}
            </div>
          </div>
          {/* 無形固定資産 */}
          <div
            className="bg-green-100 border-x-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
            style={{ height: bsSummaryHeightClass.intangibleAssetsHeightClass }}
          >
            <div className={intangibleAssetsRatio < minRatio ? "hidden" : ""}>
              {intangibleAssetsRatio > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="無形固定資産"
                  valueStr={data.intangible_assets.current.toLocaleString()}
                  ratio={intangibleAssetsRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="無形固定資産"
                  valueStr={data.intangible_assets.current.toLocaleString()}
                  ratio={intangibleAssetsRatio}
                  singleLine={true}
                />
              )}
            </div>
          </div>
          {/* 投資その他の資産 */}
          <div
            className="bg-yellow-100 rounded-bl-2xl border-x-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
            style={{
              height: bsSummaryHeightClass.investmentsAndOtherAssetsHeightClass,
            }}
          >
            <div
              className={
                investmentsAndOtherAssetsRatio < minRatio ? "hidden" : ""
              }
            >
              {investmentsAndOtherAssetsRatio > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="投資その他の資産"
                  valueStr={data.investments_and_other_assets.current.toLocaleString()}
                  ratio={investmentsAndOtherAssetsRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="投資その他の資産"
                  valueStr={data.investments_and_other_assets.current.toLocaleString()}
                  ratio={investmentsAndOtherAssetsRatio}
                  singleLine={true}
                />
              )}
            </div>
          </div>
        </div>
        {/* 貸方 */}
        <div className="h-[500px] w-52">
          {/* 流動負債 */}
          <div
            className="bg-gray-100 rounded-tr-2xl border-y-2 border-r-2 border-gray-600 text-center flex items-center justify-center"
            style={{
              height: bsSummaryHeightClass.currentLiabilitiesHeightClass,
            }}
          >
            <div className={currentLiabilitiesRatio < minRatio ? "hidden" : ""}>
              {currentLiabilitiesRatio > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="流動負債"
                  valueStr={data.current_liabilities.current.toLocaleString()}
                  ratio={currentLiabilitiesRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="流動負債"
                  valueStr={data.current_liabilities.current.toLocaleString()}
                  ratio={currentLiabilitiesRatio}
                  singleLine={true}
                />
              )}
            </div>
          </div>
          {/* 固定負債 */}
          <div
            className="bg-purple-100 border-r-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
            style={{ height: bsSummaryHeightClass.fixedLiabilitiesHeightClass }}
          >
            <div className={fixedLiabilitiesRatio < minRatio ? "hidden" : ""}>
              {fixedLiabilitiesRatio > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="固定負債"
                  valueStr={data.fixed_liabilities.current.toLocaleString()}
                  ratio={fixedLiabilitiesRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="固定負債"
                  valueStr={data.fixed_liabilities.current.toLocaleString()}
                  ratio={fixedLiabilitiesRatio}
                  singleLine={true}
                />
              )}
            </div>
          </div>
          {/* 純資産 */}
          <div
            className="bg-orange-100 rounded-br-2xl border-r-2 border-b-2 border-gray-600 text-center flex items-center justify-center"
            style={{ height: bsSummaryHeightClass.netAssetsHeightClass }}
          >
            <div className={netAssetsRatio < minRatio ? "hidden" : ""}>
              {netAssets > singleLineRatio ? (
                <SummaryTitleTexts
                  titleName="純資産"
                  valueStr={data.net_assets.current.toLocaleString()}
                  ratio={netAssetsRatio}
                  singleLine={false}
                />
              ) : (
                <SummaryTitleTexts
                  titleName="純資産"
                  valueStr={data.net_assets.current.toLocaleString()}
                  ratio={netAssetsRatio}
                  singleLine={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {hiddenTitles && hiddenTitles.length > 0 && (
        <div className="flex justify-center md:justify-start">
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

export default BsSummary;
