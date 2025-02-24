import { Button } from "@/components/ui/button";
import Navheader from "@/customui/navheader";
import CreateTabs from "@/app/create/createTabs"


export default function Home() {
  return (
    <main>
      {/* <Navheader> */}
        {/* TABS */}
        <CreateTabs />
      {/* </Navheader> */}
    </main>
  );
}
