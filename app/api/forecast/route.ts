import { fetchData } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { forecastHorizon, startTime, endTime } = await req.json();
    const data = await fetchData(startTime, endTime, forecastHorizon);
    console.log("forecastedData", data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
