import { useEffect, useState } from "react";
import { GetStockParams, PeriodOption, StockItem } from "../types/types";
import { getStocks } from "../utils/apis";
import StockChart from "./StockChart";
import { formatSecurityCode } from "../utils/funcs";
import PeriodOptionItem from "./PeriodOptionItem";
import StockChartSkelton from "./StockChartSkelton";

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
  // period: '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'
  // interval: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1d, 5d, 1wk, 1mo, 3mo

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
      handleGetStocks(defaultPeriodOption);
    }
  }, [ticker]);

  const handleGetStocks = async (periodOption: PeriodOption) => {
    setIsLoading(true);
    const params: GetStockParams = {
      ticker: ticker,
      period: periodOption.period,
      interval: periodOption.interval,
    };
    const result = await getStocks(params);
    if (result.length > 0) {
      setStocks(result);
    }
    setIsLoading(false);
  };

  const onClickPeriod = async (periodOption: PeriodOption) => {
    await handleGetStocks(periodOption);
    setPeriodData(periodOption);
  };

  return (
    <>
      <div className="flex justify-center text-gray-700">
        {periodOptions.map((option) => (
          <PeriodOptionItem
            key={option.title}
            periodOption={option}
            onClick={onClickPeriod}
            selected={option.title === periodData.title}
          />
        ))}
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          <StockChartSkelton />
        </div>
      ) : (
        <StockChart data={stocks} periodOption={periodData} />
      )}
    </>
  );
};

export default Stock;
