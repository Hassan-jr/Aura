import { Button } from "@/components/ui/button";
import Navheader from "@/customui/navheader";
import CreateTabs from "./createTabs"


export default function Home() {
  return (
    <main>
      <Navheader>
        {/* TABS */}
        <CreateTabs />
      </Navheader>
    </main>
  );
}
