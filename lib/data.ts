"use server";
import { ActualData, ForecastData, MergedData } from "@/types/forecast";

const formatDate = (date: string) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month =
    currentDate.getMonth() + 1 > 9
      ? `${currentDate.getMonth() + 1}`
      : `0${currentDate.getMonth() + 1}`;
  const day =
    currentDate.getDate() > 9
      ? `${currentDate.getDate()}`
      : `0${currentDate.getDate()}`;
  return `${year}-${month}-${day}`;
};

export async function getData(startTime: string, endTime: string) {
  try {
    const _startTime = formatDate(startTime);
    const _endTime = formatDate(endTime);
    const params = new URLSearchParams({
      fuelType: "WIND",
      settlementDateFrom: _startTime,
      settlementDateTo: _endTime,
      publishDateFrom: startTime,
      publishDateTo: endTime,
    });

    const response = await fetch(
      `${process.env.DATASET_URI}/FUELHH/stream?${params.toString()}`,
      {
        method: "GET",
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as ActualData[];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function forecastData(startTime: string, endTime: string) {
  try {
    const _startTime = formatDate(startTime);
    const _endTime = formatDate(endTime);
    const params = new URLSearchParams({
      publishDateTimeFrom: _startTime,
      publishDateTimeTo: _endTime,
    });
    const response = await fetch(
      `${process.env.DATASET_URI}/WINDFOR/stream?${params.toString()}`,
      {
        method: "GET",
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as ForecastData[];
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
}

const mergeDataAndForecast = (data: ActualData[], forecast: ForecastData[]) => {
  const finalResult: MergedData[] = [];
  const mergedData: Record<string, MergedData> = {};

  for (const item of data) {
    mergedData[item["startTime"]] = {
      actual: item.generation,
      forecast: null,
      startTime: item.startTime,
      publishTime: null,
    };
  }

  for (const item of forecast) {
    if (mergedData[item.startTime]) {
      mergedData[item.startTime].forecast = item.generation;
      mergedData[item.startTime].publishTime = item.publishTime;
    }
  }

  for (const key of Object.keys(mergedData)) {
    if (mergedData[key].forecast !== null) {
      finalResult.push(mergedData[key]);
    }
  }

  finalResult.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return finalResult;
};

export async function fetchData(
  startTime: string,
  endTime: string,
  forecastHorizon: number,
) {
  try {
    const data = await getData(startTime, endTime);
    const forecast = await forecastData(startTime, endTime);
    let mergedData = mergeDataAndForecast(data, forecast);
    mergedData = mergedData.filter(
      (d) =>
        d.publishTime &&
        Math.abs(
          new Date(d.startTime).getTime() - new Date(d.publishTime).getTime(),
        ) >=
          forecastHorizon * 60 * 60 * 1000,
    );
    return mergedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
