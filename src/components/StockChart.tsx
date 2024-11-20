import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { PeriodOption, StockChartData, StockItem } from "../types/types";
import { ADJ_CLOSE } from "../constants/constants";

interface Props {
  data: StockItem[];
  periodOption: PeriodOption;
}

const StockChart = (props: Props) => {
  const { data, periodOption } = props;
  let stockData: StockChartData = {
    period: [],
    prices: [],
  };
  const adjCloses: number[] = [];
  let min = 0;
  let max = 0;
  if (data && data.length > 0) {
    data.forEach((item) => {
      // 調整後終値をpush
      adjCloses.push(item.adjClose);

      // 日時の整形
      const date = new Date(item.datetime);

      if (periodOption.period === "1d") {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const padMinutes = String(minutes).padStart(2, "0");
        const timeStr = `${hours}:${padMinutes}`;
        stockData.period.push(timeStr);
      } else {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const timeStr = `${year}/${month}/${day}`;
        stockData.period.push(timeStr);
      }

      // 値の整形 [始値, 終値, 最安値, 最高値]
      const prices: number[] = [item.open, item.adjClose, item.low, item.high];
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (!min) {
        min = minPrice;
      } else if (minPrice < min) {
        min = minPrice;
      }
      if (!max) {
        max = maxPrice;
      } else if (max < maxPrice) {
        max = maxPrice;
      }

      stockData.prices.push(prices);
    });
  }

  const option: EChartsOption = {
    // title: {
    //   text: "株価",
    //   left: 0,
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: (params: any) => {
        return params
          .map((item: any) => {
            let marker: string = item.marker; // マーカーのHTML
            if (marker.includes("transparent")) {
              // marker = marker.replace("transparent", "red");
              marker = marker.replace("transparent", "black");
            }

            if (item.seriesName === ADJ_CLOSE) {
              const seriesName = item.seriesName;
              const value = item.value;

              return `${marker} <strong>${seriesName}:</strong> ${value}`;
            } else {
              const [data] = params;
              const { value } = data;
              const [index, open, close, lowest, highest] = value;

              return `
                <div>
                  <strong>${data.name}</strong><br/>
                  ${marker}<strong>開始値: </strong>${open}<br/>
                  ${marker}<strong>終値: </strong>${close}<br/>
                  ${marker}<strong>最安値: </strong>${lowest}<br/>
                  ${marker}<strong>最高値: </strong>${highest}<br/>
                </div>
              `;
            }
          })
          .join("<br/>");
      },
    },
    // legend: {
    //   data: ["日K", "MA5", "MA10", "MA20", "MA30"],
    // },
    grid: {
      left: "15%",
      // right: "10%",
      bottom: "15%",
    },
    xAxis: {
      data: stockData.period,
    },
    yAxis: {
      type: "value",
      scale: true,
      splitArea: {
        show: true,
      },
      // min: "dataMin",
      // max: "dataMax",
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        type: "candlestick",
        data: stockData.prices,
        itemStyle: {
          // color: "#00DD00", // 陽線の塗りつぶし色
          color: "black", // 陽線の塗りつぶし色
          color0: "transparent", // 陰線の塗りつぶし色
          // borderColor: "#008000", // 陽線の枠線色
          borderColor: "black", // 陽線の枠線色
          // borderColor0: "red", // 陰線の枠線色
          borderColor0: "black", // 陰線の枠線色
        },
      },
      {
        name: "調整後終値",
        type: "line",
        data: adjCloses,
        smooth: true,
        showSymbol: false,
        // lineStyle: {
        //   opacity: 0.5,
        // },
        itemStyle: {
          color: "#00DD00",
        },
      },
    ],
  };

  return <ReactECharts option={option} />;
};

export default StockChart;
