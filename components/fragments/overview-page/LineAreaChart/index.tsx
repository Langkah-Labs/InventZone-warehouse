import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Props } from "./type";

type EChartsOption = echarts.EChartsOption;
type EChartsType = echarts.EChartsType;

const option: EChartsOption = {
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      areaStyle: {},
    },
  ],
};

export default function Index({ source, xlabel, yLabel }: Props) {
  const chartElRender = useRef<HTMLDivElement>(null);
  const chartEl = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (chartElRender.current) {
      const myChart = echarts.init(chartElRender.current);
      myChart.setOption<EChartsOption>(option);
      chartEl.current = myChart;
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
    return () => {
      chartEl.current?.dispose();
    };
  }, []); // eslint-disable-line
//   useEffect(() => {
//     if (chartEl.current && source) {
//       chartEl.current.setOption<EChartsOption>({});
//     }
//   }, [source]); // eslint-disable-line

  // return <div ref={chartElRender} className="h-96 w-full" />;
  return (
    <div className="relative">
      <div ref={chartElRender} className="h-96 w-full" />
    </div>
  );
}
