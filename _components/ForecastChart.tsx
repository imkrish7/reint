"use client";

import {
  LineChart,
  Line,
  Legend,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const formatXAxisTick = (value: string): string => {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatYAxisTick = (value: number): string => {
  const val = `${value / 1000}K`;

  return val;
};

const FormatTooltipLabel = ({ values }: { values: string }) => {
  return (
    <span className="text-sm text-muted-foreground">
      {new Date(values).toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      })}
    </span>
  );
};

export const ForecastChart = ({
  data,
}: {
  data: { startTime: string; actual: number; forecast: number | null }[];
}) => {
  return (
    <LineChart
      responsive
      data={data}
      className="w-full h-full"
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 50,
      }}
    >
      <CartesianGrid stroke="var(--color-border-3)" />
      <XAxis
        tickFormatter={formatXAxisTick}
        dataKey="startTime"
        stroke="var(--color-text-3)"
        label={{ value: "Start Time", position: "bottom", offset: 20 }}
      />
      <YAxis
        tickFormatter={(value) => formatYAxisTick(value)}
        width="auto"
        stroke="var(--color-text-3)"
        label={{ value: "Power (kW)", angle: -90, position: "insideLeft" }}
      />
      <Tooltip
        cursor={{
          stroke: "var(--color-border-2)",
        }}
        contentStyle={{
          backgroundColor: "var(--color-surface-raised)",
          borderColor: "var(--color-border-2)",
        }}
        labelFormatter={(props) => <FormatTooltipLabel values={props} />}
      />
      <Legend />

      <Line
        type="monotone"
        dataKey="actual"
        stroke="var(--color-chart-1)"
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="forecast"
        stroke="var(--color-chart-2)"
        dot={false}
      />
    </LineChart>
  );
};
