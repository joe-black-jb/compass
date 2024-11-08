import React from "react";
import TitleMarker from "./TitleMarker";

const HowToUse = () => {
  return (
    <div className="font-extralight">
      <div className="flex justify-between items-center">
        <TitleMarker title="使い方" />
      </div>
      <p>
        　ホーム画面の検索窓に調べたい企業名を検索すると、ヒットした企業名が表示されます。
      </p>
      <p>
        　表示された候補の中から特定の企業名をクリックすると詳細画面に遷移し、以下のデータを確認することができます。
      </p>
      <br />
      <ul className="list-disc">
        <li className="ml-8">
          比例縮尺図（B/S、P/L
          の主要項目を金額に応じた面積で記載し図解したもの）
        </li>
        <li className="ml-8">売上高営業利益率</li>
        <li className="ml-8">自己資本比率</li>
        <li className="ml-8">キャッシュフロー</li>
        <li className="ml-8">財務三表</li>
      </ul>
    </div>
  );
};

export default HowToUse;
