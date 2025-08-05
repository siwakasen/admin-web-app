"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TravelPackageSchema } from "@/lib/validations/travel.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { TravelPackages } from "@/interfaces";

interface TravelPackagesFormProps {
  onNext: (data: any) => void;
  initialData?: TravelPackages;
  isEditing?: boolean;
}

export function TravelPackagesForm({ onNext, initialData, isEditing = false }: TravelPackagesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(TravelPackageSchema),
    defaultValues: {
      package_name: "",
      description: "",
      package_price: 0,
      duration: 0,
      max_persons: 0,
      itineraries: [""],
      includes: [""],
    },
    mode: "onChange",
  });

  // Set initial values when editing
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        package_name: initialData.package_name,
        description: initialData.description,
        package_price: initialData.package_price,
        duration: initialData.duration,
        max_persons: initialData.max_persons,
        itineraries: initialData.itineraries.length > 0 ? initialData.itineraries : [""],
        includes: initialData.includes.length > 0 ? initialData.includes : [""],
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Filter out empty strings and validate
      const filteredItineraries = data.itineraries.filter((item: string) => item.trim() !== "");
      const filteredIncludes = data.includes.filter((item: string) => item.trim() !== "");
      
      // Check if we have at least one non-empty item in each array
      if (filteredItineraries.length === 0) {
        form.setError("itineraries", {
          type: "manual",
          message: "Itineraries are required"
        });
        setIsSubmitting(false);
        return;
      }
      
      if (filteredIncludes.length === 0) {
        form.setError("includes", {
          type: "manual",
          message: "Includes are required"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Clear any existing errors
      form.clearErrors(["itineraries", "includes"]);
      
      // Convert string arrays to proper format
      const formattedData = {
        ...data,
        package_price: Number(data.package_price),
        duration: Number(data.duration),
        max_persons: Number(data.max_persons),
        itineraries: filteredItineraries,
        includes: filteredIncludes,
      };
      
      
      onNext(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItinerary = () => {
    const currentItineraries = form.getValues("itineraries");
    form.setValue("itineraries", [...currentItineraries, ""], { shouldValidate: true });
    // Trigger validation after adding
    setTimeout(() => {
      form.trigger("itineraries");
    }, 0);
  };

  const removeItinerary = (index: number) => {
    const currentItineraries = form.getValues("itineraries");
    if (currentItineraries.length > 1) {
      form.setValue("itineraries", currentItineraries.filter((_, i) => i !== index), { shouldValidate: true });
      // Trigger validation after removing
      setTimeout(() => {
        form.trigger("itineraries");
      }, 0);
    }
  };

  const addInclude = () => {
    const currentIncludes = form.getValues("includes");
    form.setValue("includes", [...currentIncludes, ""], { shouldValidate: true });
    // Trigger validation after adding
    setTimeout(() => {
      form.trigger("includes");
    }, 0);
  };

  const removeInclude = (index: number) => {
    const currentIncludes = form.getValues("includes");
    if (currentIncludes.length > 1) {
      form.setValue("includes", currentIncludes.filter((_, i) => i !== index), { shouldValidate: true });
      // Trigger validation after removing
      setTimeout(() => {
        form.trigger("includes");
      }, 0);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="package_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter package name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="package_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter package price"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter duration in hours"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_persons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Persons</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter max persons"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter package description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Itineraries</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItinerary}
            >
              Add Itinerary
            </Button>
          </div>
          
          {form.watch("itineraries").map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`itineraries.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Itinerary ${index + 1}`} {...field} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItinerary();
                        }
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("itineraries").length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItinerary(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {form.formState.errors.itineraries && (
            <FormMessage>
              {form.formState.errors.itineraries.message}
            </FormMessage>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Includes</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInclude}
            >
              Add Include
            </Button>
          </div>
          
          {form.watch("includes").map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`includes.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Include ${index + 1}`} {...field} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addInclude();
                        }
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("includes").length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeInclude(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {form.formState.errors.includes && (
            <FormMessage>
              {form.formState.errors.includes.message}
            </FormMessage>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update" : "Next")}
          </Button>
        </div>
      </form>
    </Form>
  );
} 