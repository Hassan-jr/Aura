"use client";
import Stepper from "./stepper";
import LoraDetails from "./loradetails";
import TrainImgUpload from "./uploadImgs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoraCards from "@/components/lora/lora-cards";

const Train = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2 rounded-md p-1">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-semibold">Start Training Product Model</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Train Lora Model</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] m-0 max-h-[98vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Train Lora Model</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-1">
              <TrainImgUpload />
              <LoraDetails />
              <Stepper setOpen={setOpen} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <LoraCards />
    </div>
  );
};

export default Train;
