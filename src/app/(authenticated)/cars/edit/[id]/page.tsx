"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent } from "@/components/ui/card";
import { CarsForm } from "@/app/(authenticated)/cars/_components/cars-form";
import { CarsImageForm } from "@/app/(authenticated)/cars/_components/cars-image-form";
import { useGetCarDetail, useUpdateCar } from "@/hooks/cars.hook";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { CarsDetailResponse, Car } from "@/interfaces";
import { TypeCarSchema } from "@/lib/validations/cars.schemas";

export default function EditCarPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const carId = Number(params.id);
  const initialStep = searchParams.get('step') ? Number(searchParams.get('step')) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [carData, setCarData] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  // Fetch car data on component mount
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await useGetCarDetail(carId);
        if ('data' in response) {
          setCarData(response.data);
        } else {
          toast.error("Failed to fetch car data");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        toast.error("Failed to fetch car data");
      } finally {
        setIsLoading(false);
      }
    };

    if (carId) {
      fetchCarData();
    }
  }, [carId, refetch]);

  const handleCarSubmit = async (data: TypeCarSchema) => {
    try {
      const response: CarsDetailResponse | {status?: number, errors?: any} 
      = await useUpdateCar(carId, data);
      if('errors' in response) {
        if(response.status === 403) {
          toast.error("You are not authorized to update this car");
        } else {
          toast.error(response.errors?.message || "Failed to update car");
        }
        return;
      } else if('data' in response) {
        setCarData(response.data);
        setCurrentStep(2);
        // Update URL to include step parameter
        const url = new URL(window.location.href);
        url.searchParams.set('step', '2');
        window.history.replaceState({}, '', url.toString());
        toast.success("Car updated successfully!");
      }        
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error("Failed to update car. Please try again.");
    }
  };

  const steps = [
    {
      id: 1,
      title: "Car Details",
      description: "Update car information",
      icon: "1",
    },
    {
      id: 2,
      title: "Update Image",
      description: "Update image for your car",
      icon: "2",
    },
  ];

  if (isLoading) {
    return (
      <section>
        <HeaderNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading car data...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!carData) {
    return (
      <section>
        <HeaderNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Car not found</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

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
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer ${
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground hover:bg-primary/80"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground/70"
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
              {currentStep === 1 && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      Edit Car
                    </h1>
                    <p className="text-muted-foreground">
                      Update the details for your car.
                    </p>
                  </div>
                  <CarsForm 
                    onNext={handleCarSubmit} 
                    initialData={carData}
                    isEditing={true}
                  />
                </div>
              )}

              {currentStep === 2 && carData && (
                <CarsImageForm
                  carId={carId}
                  isEditing={true}
                  existingImage={carData.car_image}
                  onBack={() => {
                    setCurrentStep(1);
                    // Update URL to remove step parameter when going back
                    const url = new URL(window.location.href);
                    url.searchParams.delete('step');
                    window.history.replaceState({}, '', url.toString());
                  }}
                  onRefetch={() => setRefetch(!refetch)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 