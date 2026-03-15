"use client";

import {
  LineChart,
  Line,
  Legend,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
  TooltipContentProps,
} from "recharts";

const formatXAxisTick = (value: string): string => {
  return new Date(value).toUTCString();
};

const formatYAxisTick = (value: number): string => {
  const val = `${value / 1000}K`;

  return val;
};

const FormatTooltipLabel = ({ payload }: TooltipContentProps) => {
  return (
    <div className="flex flex-col bg-gray-200/60 rounded-md p-2 backdrop-blur-2xl">
      <span className="text-sm text-muted-foreground">
        StartTime: {new Date(payload?.[0]?.payload?.startTime).toUTCString()}
      </span>
      <span className="text-sm text-muted-foreground">
        PublishTime:{" "}
        {new Date(payload?.[0]?.payload?.publishTime).toUTCString()}
      </span>
      <span className="text-sm text-muted-foreground">
        Actual: {payload?.[0]?.payload?.actual}
      </span>
      <span className="text-sm text-muted-foreground">
        Forecast: {payload?.[0]?.payload?.forecast}
      </span>
    </div>
  );
};

export const ForecastChart = ({
  data,
}: {
  data: {
    startTime: string;
    actual: number;
    forecast: number | null;
    publishTime: string | null;
  }[];
}) => {
  return (
    <LineChart
      responsive
      data={data}
      className="w-full h-full"
      margin={{
        top: 5,
        right: 30,
        left: 0,
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
        label={{ value: "Power (MW)", angle: -90, position: "insideLeft" }}
      />
      <Tooltip
        cursor={{
          stroke: "var(--color-border-2)",
        }}
        contentStyle={{
          backgroundColor: "var(--color-surface-raised)",
          borderColor: "var(--color-border-2)",
        }}
        content={FormatTooltipLabel}
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
