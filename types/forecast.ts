export interface ActualData {
  generation: number;
  settlementDate: string;
  fuelType: string;
  startTime: string;
  publishTime: string;
  dataset: string;
  settlementPeriod: number;
}

export interface ForecastData {
  publishTime: string;
  startTime: string;
  generation: number;
  dataset: string;
}
