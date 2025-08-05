"use client";

import { useState } from "react";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent } from "@/components/ui/card";
import { CarsForm } from "../_components/cars-form";
import { CarsImageForm } from "../_components/cars-image-form";
import { useCreateCar } from "@/hooks/cars.hook";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { CarsDetailResponse } from "@/interfaces";
import { TypeCarSchema } from "@/lib/validations/cars.schemas";
import { useRouter } from "next/navigation";

export default function CreateCarPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [carId, setCarId] = useState<number | null>(null);
  const router = useRouter();

  const handleCarSubmit = async (data: TypeCarSchema) => {
    try {
      const response: CarsDetailResponse | {status?: number, errors?: any} = await useCreateCar(data);
      if('errors' in response) {
        if(response.status === 403) {
          toast.error("You are not authorized to create a car");
        } else {
          toast.error(response.errors?.message || "Failed to create car");
        }
        return;
      } else if('data' in response) {
        setCarId(response.data?.id);
        setCurrentStep(2);
        toast.success("Car created successfully! Now add an image.");
      }        
    } catch (error) {
      console.error("Error creating car:", error);
      toast.error("Failed to create car. Please try again.");
    }
  };

  const steps = [
    {
      id: 1,
      title: "Car Details",
      description: "Provide car information",
      icon: "1",
    },
    {
      id: 2,
      title: "Upload Image",
      description: "Add image to your car",
      icon: "2",
    },
  ];

  return (
    <section>
      <HeaderNavigation />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-4xl mx-auto w-full">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <h3
                        className={`text-sm font-semibold ${
                          currentStep >= step.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-colors ${
                        currentStep > step.id
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    Create New Car
                  </h1>
                  <p className="text-muted-foreground">
                    Fill in the details for your new car.
                  </p>
                </div>
                {currentStep === 1 && (
                  <CarsForm onNext={handleCarSubmit} />
                )}

                {currentStep === 2 && carId && (
                  <CarsImageForm
                    carId={carId}
                    onBack={() => setCurrentStep(1)}
                    onRefetch={() => {
                      // Redirect to cars page after image upload
                      router.push("/cars");
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
