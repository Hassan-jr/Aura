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
    <div className="w-full bg-card/100 mt-0 md:mt-2">
      <div className=" shadow-md w-full flex flex-nowrap justify-evenly align-middle gap-1 p-2 mb-2">
        <Button
          onClick={handleIstrain}
          variant="outline"
          className={
            istrain
              ? "w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white"
              : "w-full dark:text-black text-black"
          }
        >
          Train Your Models
        </Button>
        <Button
          onClick={handleIsgen}
          variant="outline"
          className={
            isgen
              ? "w-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:text-white"
              : "w-full  dark:text-black text-black"
          }
        >
          Generate Visuals
        </Button>
      </div>

      {isgen === true && <PrevGen />}

      {istrain === true && <Train />}
    </div>
  );
}
