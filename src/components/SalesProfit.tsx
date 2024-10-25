import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Fundamental } from "../types/types";
import { Legend } from "@headlessui/react";

interface Props {
  fundamentals: Fundamental[];
}

const SalesProfit = (props: Props) => {
  const { fundamentals } = props;

  /*
  [
    {
      "company_name": "フィンテック　グローバル株式会社",
      "period_start": "2020-10-01",
      "period_end": "2021-09-30",
      "sales": 8107368,
      "operating_profit": 178088,
      "liabilities": 9018467,
      "net_assets": 7439120
    }
  ]
  */

  // 単位をつけるフォーマッタ関数
  const formatYAxis = (tickItem: number, index: number): string => {
    if (tickItem >= 1000000) {
      return `${tickItem / 10000}万`; // 10000で割り万単位にする
    }
    return `${tickItem}`;
  };

  // 綺麗にグラフが描けるように加工
  const sales = fundamentals.map((fundamental) => {
    return {
      period: fundamental.period_start,
      sales: fundamental.sales,
    };
  });
  const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];

  return (
    <div className="ml-8">
      <div>SalesProfit</div>
      <BarChart width={730} height={250} data={sales}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
      {/* 公式より */}
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </div>
  );
};

export default SalesProfit;
