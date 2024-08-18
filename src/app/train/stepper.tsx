'use client'
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

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
    console.log("clikced");
    
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted!');
  };

  return (
    <form action="#" className="w-full" method="post">
      <div data-stepper="true">
        <div className="card">
          <div className="card-header flex justify-between items-center gap-4 py-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-2.5 items-center ${index === currentStep ? 'active' : ''}`}
                data-stepper-item={`#stepper_${index + 1}`}
              >
                <div className={`rounded-full size-10 flex items-center justify-center text-md font-semibold ${
                  index < currentStep
                    ? 'bg-success text-success-inverse'
                    : index === currentStep
                    ? 'bg-primary text-primary-inverse'
                    : 'bg-primary-light text-primary'
                }`}>
                  <span className={index < currentStep ? 'hidden' : ''} data-stepper-number="true">
                    {index + 1}
                  </span>
                  {index < currentStep && (
                    <i className="ki-outline ki-check text-xl">✓</i>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className={`text-sm font-medium ${
                    index < currentStep ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h4>
                  <span className={`text-2sm ${
                    index < currentStep ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="card-body py-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={index === currentStep ? '' : 'hidden'}
                id={`stepper_${index + 1}`}
              >
                {step.content}
              </div>
            ))}
          </div>
          <div className="card-footer py-8 flex justify-between">
            <div>
              <button
                type="button"
                className={`btn btn-light ${currentStep === 0 ? 'hidden' : ''}`}
                onClick={handleBack}
              >
                Back
              </button>
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  className="z-50"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Stepper;