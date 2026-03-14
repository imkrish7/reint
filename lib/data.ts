
// const API_URL = "https://elexon-insights-iris.servicebus.windows.net/iris.89a8bbcb-9cc2-41ea-833f-833b47ad9e9c"



interface ActualData {
    generation: number;
    settlementDate: string;
    fuelType: string;
    startTime: string;
    publishTime: string;
    dataset: string;
    settlementPeriod: number;
}

interface ForecastData {
    publishTime: string;
    startTime: string;
    generation: number;
    dataset: string;
}



export async function getData(){

     try {
        const params = new URLSearchParams({
            fuelType: "WIND",
            settlementDateFrom: "2024-01-01",
            settlementDateTo: "2024-01-02",
            publishDateFrom: "2024-01-01",
            publishDateTo: "2024-01-02",
            
        });

        const response = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?${params.toString()}`, {
            method: "GET",
        }); 
        if (!response.ok) {
            console.log(response)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data as ActualData[];
    } catch (error) {
        console.error("Error fetching data:", error);
       throw error
    }
}

export async function forecastData() {
    try {
        const params = new URLSearchParams({
            publishDateTimeFrom: "2024-01-01",
            publishDateTimeTo: "2024-01-02",
            
        });

        console.dir(params.toString())
         const response = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?${params.toString()}`, {
            method: "GET",
        }); 
        if (!response.ok) {
            console.log(response)
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
    const finalResult=[];
    const mergedData: Record<string, {actual: number, forecast: number | null, startTime: string}> = {}

    for(const item of data){
        mergedData[item["startTime"]] = {
            actual: item.generation,
            forecast: null,
            startTime: item.startTime
        }
    }

    for(const item of forecast){
        if(mergedData[item.startTime]){
            mergedData[item.startTime].forecast = item.generation
        }
    }


    for(const key of Object.keys(mergedData)){
        console.log(mergedData[key], key)
        if(mergedData[key].forecast !== null){
            finalResult.push(mergedData[key])
        }
    }
    
    finalResult.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
   
    return finalResult;
}


export async function fetchData(){
    try {
        const data = await getData();
        
        const forecast = await forecastData();
        
        const mergedData = mergeDataAndForecast(data, forecast);
        return mergedData;
        
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
} 