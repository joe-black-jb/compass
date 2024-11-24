import { useEffect, useState } from "react";
import {
  GetStockParams,
  LineType,
  Option,
  PeriodOption,
  StockItem,
} from "../types/types";
import { getStocks } from "../utils/apis";
import StockChart from "./StockChart";
import { formatSecurityCode } from "../utils/funcs";
import PeriodOptionItem from "./PeriodOptionItem";
import StockChartSkelton from "./StockChartSkelton";
import DropDown from "./DropDown";

interface Props {
  securityCode?: string;
}

const Stock = (props: Props) => {
  const { securityCode } = props;

  const defaultPeriodOption: PeriodOption = {
    title: "1日",
    period: "1d",
    interval: "5m",
  };

  const [periodData, setPeriodData] =
    useState<PeriodOption>(defaultPeriodOption);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  let ticker = "";
  if (securityCode) {
    ticker = formatSecurityCode(securityCode);
  }

  const [stocks, setStocks] = useState<StockItem[]>([]);
  // 10年分の株価データ
  const [fullStocks, setFullStocks] = useState<StockItem[]>([]);
  // 当日の株価データ
  const [todaysStocks, setTodaysStocks] = useState<StockItem[]>([]);
  // スライダーの開始位置 (%)
  const [sliderStartPosition, setSliderStartPosition] = useState<number>(0);
  // 移動平均の有無
  const [hasMa, setHasMa] = useState<boolean>(false);

  // 株価の lineType
  const [lineType, setLineType] = useState<LineType>("candlestick");

  /* 指定可能な期間 (period) と間隔 (interval)
  period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
  interval: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1d, 5d, 1wk, 1mo, 3mo
  */

  const periodOptions: PeriodOption[] = [
    {
      title: "1日",
      period: "1d",
      interval: "5m",
    },
    {
      title: "1ヶ月",
      period: "1mo",
      interval: "1d",
    },
    {
      title: "6ヶ月",
      period: "6mo",
      interval: "1d",
    },
    {
      title: "1年",
      period: "1y",
      interval: "5d",
    },
    {
      title: "2年",
      period: "2y",
      interval: "1wk",
    },
    {
      title: "10年",
      period: "10y",
      interval: "1wk",
    },
  ];

  useEffect(() => {
    if (ticker) {
      initialGetStocks();
    }
  }, [ticker]);

  const initialGetStocks = async () => {
    const todaysParams: GetStockParams = {
      ticker,
      period: "1d",
      interval: "5m",
    };
    const fullParams: GetStockParams = {
      ticker,
      period: "10y",
      interval: "1d",
    };

    // 当日データ取得
    const todaysStockData = await getStocks(todaysParams);
    if (todaysStockData.length > 0) {
      setStocks(todaysStockData);
      setIsLoading(false);
      setTodaysStocks(todaysStockData);
    }

    // 10年分データ取得
    const fullStockData = await getStocks(fullParams);
    if (fullStockData.length > 0) {
      setFullStocks(fullStockData);
    }
    setIsLoading(false);
  };

  const onClickPeriod = async (periodOption: PeriodOption) => {
    if (periodOption.period === "1d") {
      setSliderStartPosition(0);
      setHasMa(false);
      setStocks(todaysStocks);
    } else {
      switch (periodOption.period) {
        case "1mo":
          // 99.15 くらいがより正確に1ヶ月分表示できる
          setSliderStartPosition(99);
          break;
        case "6mo":
          setSliderStartPosition(95);
          break;
        case "1y":
          setSliderStartPosition(90);
          break;
        case "2y":
          setSliderStartPosition(80);
          break;
        case "10y":
          setSliderStartPosition(0);
          break;
      }
      setHasMa(true);
      setStocks(fullStocks);
    }
    setPeriodData(periodOption);
  };

  const ArrangedStockChart = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <StockChartSkelton />
        </div>
      );
    }
    if (!isLoading && (!stocks || stocks.length === 0)) {
      return (
        <div>
          <StockChartSkelton noData={true} />
        </div>
      );
    }
    return (
      <div className="mb-10 relative">
        <StockChart
          data={stocks}
          periodOption={periodData}
          start={sliderStartPosition}
          hasMa={hasMa}
          lineType={lineType}
        />
        <div></div>
      </div>
    );
  };

  const lineOptions: Option[] = [
    {
      key: "candlestick",
      title: "ローソク",
      selected: true,
    },
    {
      key: "line",
      title: "線",
      selected: false,
    },
  ];

  const handleChangeLineOption = (key: string) => {
    console.log("選択した LineType: ", key);
    setLineType(key as LineType);
  };

  return (
    <>
      <div className="flex justify-end items-center text-gray-700">
        {periodOptions.map((option) => (
          <PeriodOptionItem
            key={option.title}
            periodOption={option}
            onClick={onClickPeriod}
            selected={option.title === periodData.title}
          />
        ))}
        {/* プルダウン */}
        <div className="ml-2">
          <DropDown options={lineOptions} onChange={handleChangeLineOption} />
        </div>
      </div>
      {ArrangedStockChart()}
    </>
  );
};

export default Stock;
