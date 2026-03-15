import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <p className="text-xl text-gray-500">
          To see the stats, Please link below
        </p>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </main>
    </div>
  );
}
