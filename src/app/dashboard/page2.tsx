import ChartTEST from "@/components/charts/test";
import ClientFetch from "./clientFetch"


export default async function Page() {

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ClientFetch />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <ChartTEST />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
