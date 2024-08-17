"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWizard } from "react-use-wizard";

const StepperFooter = () => {
  const {
    nextStep,
    previousStep,
    isLoading,
    activeStep,
    stepCount,
    isLastStep,
    isFirstStep,
  } = useWizard();

  return (
    <Card>
      <Button
        onClick={() => previousStep()}
        disabled={isLoading || isFirstStep}
      >
        Previous
      </Button>
      <Button
        className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 z-20"
        onClick={() => nextStep()}
        disabled={isLoading || isLastStep}
      >
        Next
      </Button>
      
    </Card>
  );
};

export default StepperFooter;
