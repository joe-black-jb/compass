import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

const StockChartSkelton = () => {
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
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      data: ["", "", "", ""],
    },
    yAxis: {
      type: "value",
      splitArea: {
        show: true,
      },
      min: 0,
      max: 10,
      // axisLine: {
      //   show: true, // Y軸の軸線を表示
      // },
      axisTick: {
        show: false, // 目盛りを非表示
      },
      axisLabel: {
        show: false, // ラベルを非表示
      },
    },
    series: [
      {
        type: "candlestick",
        data: [],
      },
      {
        name: "",
        type: "line",
        data: [],
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0,
        },
        itemStyle: {
          color: "#00DD00",
        },
      },
    ],
  };
  return <ReactECharts option={option} />;
};

export default StockChartSkelton;
