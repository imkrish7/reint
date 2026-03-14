"use client";
import { ForecastChart } from "@/_components/ForecastChart";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import z from "zod";
import { ForecastDataSchema } from "@/schemas/forecast";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { useTransition, useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const Page = () => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<
    { actual: number; forecast: number; startTime: string }[]
  >([]);

  const form = useForm<z.infer<typeof ForecastDataSchema>>({
    resolver: zodResolver(ForecastDataSchema),
    defaultValues: {
      startTime: new Date(2024, 0, 1),
      endTime: new Date(2024, 0, 2),
      forecastHorizon: 4,
    },
  });

  const fetchData = (values: z.infer<typeof ForecastDataSchema>) => {
    startTransition(async () => {
      const response = await fetch("/api/forecast", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        toast.error("Failed to fetch forecast");
      }
      const forecastData = await response.json();
      setData(forecastData);
    });
  };

  useEffect(() => {
    const startTime = new Date(2024, 0, 1);
    const endTime = new Date(2024, 0, 2);
    const forecastHorizon = 4;
    const values = { startTime, endTime, forecastHorizon };
    fetchData(values);
  }, []);

  const handleReset = () => {
    form.reset();
    const startTime = new Date(2024, 0, 1);
    const endTime = new Date(2024, 0, 2);
    const forecastHorizon = 4;
    const values = { startTime, endTime, forecastHorizon };
    fetchData(values);
  };

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Wind Power Forecast
      </h1>
      <div className="w-full h-20 mb-4 p-4 bg-indigo-100 rounded flex items-center">
        <form onSubmit={form.handleSubmit(fetchData)}>
          <div className="flex w-full gap-2 justify-center items-center">
            <Controller
              name="startTime"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className={"text-gray-900 text-md font-semibold"}
                    >
                      Start Time
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            id="date-picker-simple"
                            className="justify-start font-normal text-gray-600"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverContent
                        className="w-auto p-0 text-gray-400"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={new Date(2024, 0, 1)}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                );
              }}
            />
            <Controller
              name="endTime"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className={"text-gray-900 text-md font-semibold"}
                    >
                      End Time
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            id="date-picker-simple"
                            className="justify-start font-normal  text-gray-600"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={new Date(2024, 0, 1)}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                );
              }}
            />
            <Controller
              name="forecastHorizon"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className={"text-gray-900 text-md font-semibold"}
                    >
                      Forecast Horizon
                    </FieldLabel>
                    <div>
                      <Slider
                        className={"bg-green-400"}
                        value={field.value}
                        onValueChange={field.onChange}
                        step={1}
                        min={1}
                        max={10}
                      />
                    </div>
                  </Field>
                );
              }}
            />
            <div>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </div>
          </div>
        </form>
        <div>
          <Button type="button" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
      <div className="w-full">
        {form.formState.errors &&
          Object.keys(form.formState.errors).length > 0 && (
            <div className="text-md text-red-500">
              {Object.values(form.formState.errors).map((error, index) => (
                <p key={index}>{error.message}</p>
              ))}
            </div>
          )}
      </div>
      <div className="w-full h-120 p-4 flex items-center justify-center">
        {isPending ? (
          <Spinner className="size-20 text-indigo-600/50" />
        ) : (
          <ForecastChart data={data} />
        )}
      </div>
    </div>
  );
};

export default Page;
