import { getRoutes } from "@/lib/endpoint";
import Image from "next/image";

export default async function Home() {
  const routes = await getRoutes();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(routes)}
    </main>
  );
}
