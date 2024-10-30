"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Train from "./train/train";
import { PrevGen } from "./gen/gen";

export default function CreateTabs() {
  const [isgen, setIsgen] = useState(true);
  const [istrain, setIstrain] = useState(false);

  const handleIsgen = () => {
    console.log("Clicked");
    setIsgen(true);
    setIstrain(false);
  };

  const handleIstrain = () => {
    console.log("Clicked");
    setIsgen(false);
    setIstrain(true);
  };

  return (
    <div className="w-full   p-1 mt-0 md:mt-2">
      <div className="bg-card/100 w-full flex flex-nowrap justify-evenly align-middle gap-1 p-2 mb-2">
        <Button
          onClick={handleIsgen}
          variant="outline"
          className={
            isgen
              ? "w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white"
              : "w-full text-white dark:text-black"
          }
        >
          Generate Images
        </Button>
        <Button
          onClick={handleIstrain}
          variant="outline"
          className={
            istrain
              ? "w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white"
              : "w-full text-white dark:text-black"
          }
        >
          Train Your Models
        </Button>
      </div>

      {isgen === true && (
        <PrevGen />
      )}

      {istrain === true && <Train />}
    </div>
  );
}
