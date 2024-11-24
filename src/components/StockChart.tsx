import ReactECharts from "echarts-for-react";
import {
  EChartsOption,
  SeriesOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import {
  LineType,
  PeriodOption,
  StockChartData,
  StockItem,
  TooltipData,
} from "../types/types";
import {
  END,
  MA_25,
  MA_75,
  STOCK_PRICE,
  VOLUMES,
} from "../constants/constants";
import { useState } from "react";
import { isArray } from "lodash";

interface Props {
  data: StockItem[];
  periodOption: PeriodOption;
  start: number;
  hasMa: boolean;
  lineType: LineType;
}

const StockChart = (props: Props) => {
  const { data, periodOption, start, hasMa, lineType } = props;
  let stockData: StockChartData = {
    period: [],
    prices: [],
    volumes: [],
  };
  const closes: number[] = [];
  const ma25s: (number | undefined)[] = [];
  const ma75s: (number | undefined)[] = [];
  let min = 0;
  let max = 0;
  if (data && data.length > 0) {
    data.forEach((item) => {
      // 終値
      closes.push(item.close);
      // 出来高
      stockData.volumes.push(item.volume);
      // 移動平均
      if (hasMa) {
        ma25s.push(item.ma25 || undefined);
        ma75s.push(item.ma75 || undefined);
      }

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

  const formatScale = (value: number): string => {
    // 目盛りの数値が大きい場合、省略記法を使って表示
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + "B"; // 10億
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M"; // 百万
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "k"; // 千
    }
    return value.toString(); // それ以外はそのまま表示
  };
  let stockPriceSeriesOption: SeriesOption = {};

  // 線/ローソク足の切り替え
  switch (lineType) {
    case "line":
      stockPriceSeriesOption = {
        name: END,
        type: "line",
        data: closes,
        datasetIndex: 0,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: "#000080",
        },
        lineStyle: {
          width: 1,
        },
      };
      break;
    case "candlestick":
      stockPriceSeriesOption = {
        name: STOCK_PRICE,
        type: "candlestick",
        data: stockData.prices,
        datasetIndex: 0,
        itemStyle: {
          color: "black", // 陽線の塗りつぶし色
          color0: "transparent", // 陰線の塗りつぶし色
          borderColor: "black", // 陽線の枠線色
          borderColor0: "black", // 陰線の枠線色
        },
      };
      break;
  }

  const option: EChartsOption = {
    // title: {
    //   text: "株価",
    //   left: 0,
    // },
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: (
        params:
          | TooltipComponentFormatterCallbackParams
          | TooltipComponentFormatterCallbackParams[]
      ): string => {
        // タグ情報とindexを持ったオブジェクト配列を作成
        const tooltipData: TooltipData[] = [];
        if (isArray(params)) {
          params.forEach((item) => {
            // [params] 0: ローソク足, 1: MA_25, 2: MA_75, 3: Volumes
            if (!isArray(item)) {
              if (
                item.seriesName === STOCK_PRICE &&
                isArray(item.data) &&
                item.data.length >= 4
              ) {
                let marker = item.marker?.toString();
                if (marker && marker.includes("transparent")) {
                  marker = marker.replace("transparent", "black");
                }
                const [index, open, close, lowest, highest] =
                  item.data as Number[];
                const content = `
                <div>
                  <strong>${item.name}</strong><br/>
                  ${marker}<strong>開始値: </strong>${open.toLocaleString()}<br/>
                  ${marker}<strong>終値: </strong>${close.toLocaleString()}<br/>
                  ${marker}<strong>最安値: </strong>${lowest.toLocaleString()}<br/>
                  ${marker}<strong>最高値: </strong>${highest.toLocaleString()}<br/>
                </div>
                `;
                tooltipData.push({
                  index: item.seriesIndex || 0,
                  data: content,
                });
              } else if (item.seriesName === END && item.data) {
                const content = `
                  <div>
                    <strong>${item.name}</strong><br/>
                    ${item.marker} <strong>${
                  item.seriesName
                }:</strong> ${item.data.toLocaleString()}
                  </div>
                `;
                tooltipData.push({
                  index: item.seriesIndex || 0,
                  data: content,
                });
              } else if (item.data) {
                const content = `
                  <div>
                    ${item.marker} <strong>${
                  item.seriesName
                }:</strong> ${item.data.toLocaleString()}
                  </div>
                `;
                tooltipData.push({
                  index: item.seriesIndex || 0,
                  data: content,
                });
              }
            }
          });
        }

        // dataIndexの昇順に要素をソート
        tooltipData.sort((a, b) => a.index - b.index);
        return tooltipData
          .map((item) => {
            return item.data;
          })
          .join("");
      },
    },
    legend: [
      {
        data: hasMa ? [MA_25, MA_75] : [],
        top: "3%",
        left: "10%",
        itemWidth: 20,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
        },
      },
      {
        data: [VOLUMES],
        top: "65%",
        left: "10%",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
        },
      },
    ],
    grid: [
      // ローソク足
      {
        left: "10%",
        // right: "10%",
        // bottom: "15%",
        top: "60%",
        bottom: "90%",
        // bottom: 100,
      },
      {
        left: "10%",
        top: "70%",
        height: "16%",
      },
    ],
    xAxis: [
      // ローソク足
      {
        data: stockData.period,
      },
      {
        type: "category",
        gridIndex: 1,
        data: stockData.period,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      // ローソク足
      {
        type: "value",
        scale: true,
        splitArea: {
          show: true,
        },
        position: "right",
        // min: "dataMin",
        // max: "dataMax",
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        position: "right",
        axisLabel: {
          formatter: (value: number) => formatScale(value),
        },
        // axisLabel: { show: false },
        // axisLine: { show: false },
        // axisTick: { show: false },
        // splitLine: { show: false },
      },
    ],
    dataZoom: [
      // ローソク足
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start,
        end: 100,
        zoomOnMouseWheel: false,
      },
      {
        show: true,
        type: "slider",
        xAxisIndex: [0, 1],
        top: "87%",
        // bottom: "60%",
        start: 0,
        end: 100,
        height: 50,
        zoomOnMouseWheel: false,
      },
    ],
    series: [
      // 株価
      stockPriceSeriesOption,
      // 移動平均(25)
      {
        name: MA_25,
        type: "line",
        data: ma25s,
        datasetIndex: 1,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: "#00DD00",
        },
        lineStyle: {
          width: 1,
        },
      },
      // 移動平均(75)
      {
        name: MA_75,
        type: "line",
        data: ma75s,
        datasetIndex: 2,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: "red",
        },
        lineStyle: {
          width: 1,
        },
      },
      // 出来高
      {
        name: VOLUMES,
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        // data: volumes,
        data: stockData.volumes,
        datasetIndex: 3,
        // lineStyle: {
        //   opacity: 0.5,
        // },
        // itemStyle: {
        //   color: "red",
        // },
      },
    ],
  };

  return <ReactECharts style={{ height: "450px" }} option={option} />;
};

export default StockChart;
