"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted!");
  };

  return (
    <form action="#" className="w-full" method="post">
      <Card data-stepper="true">
        <div className="card">
          {/* step header */}
          <div className="card-header flex justify-between md:justify-evenly align-top items-start relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`m-0.5 md:m-1 flex flex-col justify-center items-center align-top w-24 md:w-28 ${
                  index === currentStep ? "active" : ""
                }`}
                data-stepper-item={`#stepper_${index + 1}`}
              >
                {/* Progress line */}
                {index > 0 && index < steps.length && (
                  <div
                    className="absolute top-6 h-0.5 bg-gray-200"
                    style={{
                      left: `calc(${
                        (index - 0.5) * (100 / (steps.length - 1))
                      }% - 1px)`,
                      right: `calc(${
                        (steps.length - index - 1.5) *
                        (100 / (steps.length - 1))
                      }% - 1px)`,
                      zIndex: 0,
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-in-out"
                      style={{
                        width:
                          currentStep > index
                            ? "100%"
                            : currentStep === index
                            ? `${20/index}%`
                            : "0%",
                      }}
                    />
                  </div>
                )}
                {/* step index or icon */}
                <div
                  className={`rounded-full mr-0 md:mr-1 size-10 flex items-center justify-center text-md font-semibold z-10 ${
                    index < currentStep
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-success-inverse"
                      : index === currentStep
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-primary-inverse"
                      : "bg-gradient-to-r from-slate-400 to-slate-200 text-primary"
                  }`}
                >
                  <span
                    className={index < currentStep ? "hidden" : ""}
                    data-stepper-number="true"
                  >
                    {index + 1}
                  </span>
                  {index < currentStep && (
                    <i className="ki-outline ki-check text-xl text-white">✓</i>
                  )}
                </div>
                {/* step title and description */}
                <div className="flex flex-col items-center md:items-start">
                  <h4
                    className={`text-xs md:text-sm font-bold text-center ${
                      index < currentStep
                        ? "bg-gradient-to-r from-indigo-500 dark:from-blue-100  to-purple-500 dark:to-blue-200 bg-clip-text text-transparent"
                        : "bg-gradient-to-r from-indigo-500 dark:from-white  to-purple-500 dark:to-blue-100  bg-clip-text text-transparent"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.description && (
                    <span
                      className={`text-2sm ${
                        index < currentStep ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* step content */}
          <div className="card-body py-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={index === currentStep ? "" : "hidden"}
                id={`stepper_${index + 1}`}
              >
                {step.content}
              </div>
            ))}
          </div>

          {/* step footer (buttons) */}
          <div className="card-footer py-8 flex justify-between">
            <div>
              <Button
                type="button"
                className={`btn btn-light ${currentStep === 0 ? "hidden" : ""}`}
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button type="button" className="z-50" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default Stepper;
