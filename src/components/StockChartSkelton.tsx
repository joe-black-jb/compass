import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface Props {
  noData?: boolean;
}

const StockChartSkelton = (props: Props) => {
  const { noData } = props;

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
      axisLine: {
        show: false, // X軸の軸線を表示
      },
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
  return (
    <div className="relative">
      <ReactECharts option={option} />
      {noData && (
        <div className="absolute top-0 w-full h-full flex justify-center items-center text-4xl text-gray-200">
          No Data
        </div>
      )}
    </div>
  );
};

export default StockChartSkelton;
