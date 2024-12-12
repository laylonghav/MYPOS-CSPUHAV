import React from "react";
import { Chart } from "react-google-charts";

// export const data = [
//   ["Months", "Sales"],
//   ["2013", 1000, 400],
//   ["2014", 1170, 460],
//   ["2015", 660, 1120],
//   ["2016", 1030, 540],
// ];

export const options = {
  title: "Sale summary by months",
  hAxis: { title: "Months", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 },
  // curveType: "function",
  // legend: { position: "bottom" },
  chartArea: { width: "80%", height: "70%" },
};

export default function SaleChart({ data = [] }) {
  return (
    <div
      style={{
        backgroundColor: "pink",
        padding: 15,
        margin: 2,
        borderRadius: 10,
        minHeight: 100,
      }}
      className=""
    >
      <Chart
        ExpenseChart
        chartType="AreaChart" //"LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
        // legendToggle
      />
    </div>
  );
}
