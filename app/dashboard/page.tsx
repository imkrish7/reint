import { fetchData } from "@/lib/data"
import { ForecastChart } from "@/_components/ForecastChart"


const page = async () => {

    const data = await fetchData()
    console.log(data)
  return (<div className="w-full h-full">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="w-full h-120 p-4">
      <ForecastChart data={data}/>
    </div>
  </div>
  )
}

export default page