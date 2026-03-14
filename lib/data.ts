"use server";
import { ActualData, ForecastData } from "@/types/forecast";

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

export async function getData(
  startTime: string,
  endTime: string,
  forecastHorizon: number,
) {
  try {
    const params = new URLSearchParams({
      fuelType: "WIND",
      settlementDateFrom: startTime,
      settlementDateTo: endTime,
      publishDateFrom: startTime,
      publishDateTo: endTime,
    });

    const response = await fetch(
      `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?${params.toString()}`,
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
    const params = new URLSearchParams({
      publishDateTimeFrom: startTime,
      publishDateTimeTo: endTime,
    });
    const response = await fetch(
      `https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?${params.toString()}`,
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
  const finalResult: {
    actual: number;
    forecast: number | null;
    startTime: string;
  }[] = [];
  const mergedData: Record<
    string,
    { actual: number; forecast: number | null; startTime: string }
  > = {};

  for (const item of data) {
    mergedData[item["startTime"]] = {
      actual: item.generation,
      forecast: null,
      startTime: item.startTime,
    };
  }

  for (const item of forecast) {
    if (mergedData[item.startTime]) {
      mergedData[item.startTime].forecast = item.generation;
    }
  }

  console.log("mergedData", mergedData);

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
    const _startTime = formatDate(startTime);
    const _endTime = formatDate(endTime);
    const data = await getData(_startTime, _endTime, forecastHorizon);
    const forecast = await forecastData(_startTime, _endTime);
    const mergedData = mergeDataAndForecast(data, forecast);
    return mergedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
