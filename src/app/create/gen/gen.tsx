"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import CurrentGen from "./currentgen";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GenerationCards from "./generation-card";

export const PrevGen = () => {
  const [isgen, setIsgen] = useState(false);

  return (
    <div className="bg-card/100">
      {/* Generate Image */}

      <Dialog open={isgen} onOpenChange={() => setIsgen(true)}>
        <DialogContent className="sm:max-w-[500px] p-0 m-0 max-h-[98vh] overflow-y-auto">
          <div>
            <CurrentGen cancel={setIsgen} />
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <div className="w-full flex justify-between align-middle mb-1">
          <p className="text-2xl font-semibold">Recent Generation</p>
          <Button
            onClick={() => setIsgen(true)}
            className="text-2xl font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white"
            variant="outline"
          >
            Generate Images
          </Button>
        </div>

        <GenerationCards />
      </div>
    </div>
  );
};
