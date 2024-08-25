import { Card } from "@/components/ui/card";
import Navheader from "./navheader";
import { Navtabs } from "./navtabs";

export function NavigationMenu() {
 

  return (
    <Card className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      {/* <div> */}
        <Navheader/>
        <Navtabs/>
      {/* </div> */}
    </Card>
  );
}
