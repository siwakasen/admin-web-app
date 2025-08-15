'use client';

import { useState } from 'react';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent } from '@/components/ui/card';
import { TravelPackagesForm } from '@/app/(authenticated)/travel-packages/_components/travel-packages-form';
import { useCreateTravelPackage } from '@/hooks/travel.hook';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { CreateTravelPackageResponse } from '@/interfaces';
import { TypeTravelPackageSchema } from '@/lib/validations/travel.schemas';
import { useRouter } from 'next/navigation';

export default function CreateTravelPackagePage() {
  const currentStep = 1;
  const router = useRouter();

  const handleTravelPackageSubmit = async (data: TypeTravelPackageSchema) => {
    try {
      const response:
        | CreateTravelPackageResponse
        | { status?: number; errors?: any } = await useCreateTravelPackage(
        data
      );
      if ('errors' in response) {
        if (response.status === 403) {
          toast.error('You are not authorized to create a travel package');
        } else {
          toast.error(
            response.errors?.message || 'Failed to create travel package'
          );
        }
        return;
      } else if ('data' in response && 'message' in response) {
        toast.success(response.message);
        router.push(`/travel-packages/edit/${response.data.id}?step=2`);
      }
    } catch (error) {
      console.error('Error creating travel package:', error);
      toast.error('Failed to create travel package. Please try again.');
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Package Details',
      description: 'Provide travel package information',
      icon: '1',
    },
    {
      id: 2,
      title: 'Upload Images',
      description: 'Add images to your travel package',
      icon: '2',
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
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
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
                            ? 'text-foreground'
                            : 'text-muted-foreground'
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
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
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
                    Create Travel Package
                  </h1>
                  <p className="text-muted-foreground">
                    Fill in the details for your new travel package.
                  </p>
                </div>
                <TravelPackagesForm onNext={handleTravelPackageSubmit} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
