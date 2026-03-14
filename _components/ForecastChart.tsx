"use client";

import { LineChart, Line, Legend, YAxis, XAxis, Tooltip, CartesianGrid } from "recharts";



const formatXAxisTick = (value: string): string => {
  return (new Date(value)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatYAxisTick = (value: number): string => {
  return `${value/1000}K`;
}

const formatTooltipLabel = (values: string)=> {
  console.log(values)
  return <p>{(new Date(values)).toLocaleDateString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</p>;
}

export const ForecastChart= ({data}: {data: {startTime: string, actual: number, forecast: number | null}[]}) => {



    return <LineChart responsive data={data} className="w-full h-full" margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
    }}>

      <CartesianGrid stroke="var(--color-border-3)" />
      <XAxis tickFormatter={formatXAxisTick} dataKey="startTime" stroke="var(--color-text-3)" />
      <YAxis tickFormatter={formatYAxisTick} width="auto" stroke="var(--color-text-3)" />
      <Tooltip
        cursor={{
          stroke: 'var(--color-border-2)',
        }}
        contentStyle={{
          backgroundColor: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border-2)',
        }}
        labelFormatter={formatTooltipLabel}
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
}