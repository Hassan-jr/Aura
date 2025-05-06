import { Button } from "@/components/ui/button";
import Navheader from "@/customui/navheader";
import CreateTabs from "./createTabs"
import { PrevGen } from "./gen/gen";


export default function Home() {
  return (
    <main>
      <Navheader>
        {/* TABS */}
        {/* <CreateTabs /> */}
        <PrevGen />
      </Navheader>
    </main>
  );
}
