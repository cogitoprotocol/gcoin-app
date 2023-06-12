"use client";

import { formatNumberUSD } from "lib/numbers";
import { useState } from "react";
import {
  Customized,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { useTreasuryData } from "./data";

const renderActiveShape = (props: {
  cx: any;
  cy: any;
  midAngle: any;
  innerRadius: any;
  outerRadius: any;
  startAngle: any;
  endAngle: any;
  fill: any;
  payload: any;
  percent: any;
  value: any;
}) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    payload,
    percent,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        className="fill-purple-400"
      />
      <text x={cx} y={cy} textAnchor="middle" className="text-2xl fill-white">
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={24}
        textAnchor="middle"
        className="text-md fill-zinc-400"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

const CustomizedLabel = (props: any) => {
  const { cx, cy, activeIndex, sum } = props;

  return (
    <g>
      {activeIndex == -1 && (
        <>
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            className="text-2xl fill-black dark:fill-white"
          >
            Total Assets
          </text>
          <text
            x={cx}
            y={cy}
            dy={24}
            textAnchor="middle"
            className="text-md fill-zinc-600 dark:fill-zinc-400"
          >
            {formatNumberUSD(sum, { digits: 0 })}
          </text>
        </>
      )}
    </g>
  );
};

export default function TreasuryReservesChart() {
  const [index, setIndex] = useState(-1);
  const { items, sum } = useTreasuryData();

  const onPieEnter = (_: any, idx: number) => {
    setIndex(idx);
  };
  const onPieOut = () => {
    setIndex(-1);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          className="fill-purple-500 stroke-purple-200"
          activeIndex={index}
          activeShape={renderActiveShape}
          data={items}
          cx="50%"
          cy="50%"
          innerRadius={120}
          outerRadius={160}
          dataKey="usd"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieOut}
        />
        <Customized component={CustomizedLabel} activeIndex={index} sum={sum} />
      </PieChart>
    </ResponsiveContainer>
  );
}
