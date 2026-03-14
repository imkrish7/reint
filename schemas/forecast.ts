import z from "zod";

export const ForecastDataSchema = z
  .object({
    startTime: z.date(),
    endTime: z.date(),
    forecastHorizon: z.number(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  });
