"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarSchema } from "@/lib/validations/cars.schemas";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Car } from "@/interfaces";
import { Plus, X } from "lucide-react";

interface CarsFormProps {
  onNext: (data: any) => void;
  initialData?: Car;
  isEditing?: boolean;
}

export function CarsForm({ onNext, initialData, isEditing = false }: CarsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(CarSchema),
    defaultValues: {
      car_name: "",
      car_image: "",
      car_color: "",
      police_number: "",
      transmission: "",
      description: "",
      max_persons: 0,
      price_per_day: 0,
      includes: [""],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Set initial values when editing
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        car_name: initialData.car_name,
        car_image: initialData.car_image,
        car_color: initialData.car_color,
        police_number: initialData.police_number,
        transmission: initialData.transmission,
        description: initialData.description,
        max_persons: initialData.max_persons,
        price_per_day: initialData.price_per_day,
        includes: initialData.includes.length > 0 ? initialData.includes : [""],
      });
    }
  }, [initialData, isEditing, form]);

  // Watch includes array and validate
  const includes = form.watch("includes");
  useEffect(() => {
    if (form.formState.isSubmitted) {
      validateIncludes();
    }
  }, [includes, form.formState.isSubmitted]);



  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Validate includes array
      if (!validateIncludes()) {
        setIsSubmitting(false);
        return;
      }
      
      // Filter out empty strings
      const filteredIncludes = data.includes.filter((item: string) => item.trim() !== "");
      
      // Convert string arrays to proper format
      const formattedData = {
        ...data,
        max_persons: Number(data.max_persons),
        price_per_day: Number(data.price_per_day),
        includes: filteredIncludes,
        car_image: "", // Empty string for now, will be handled in image form
      };
      
      onNext(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInclude = () => {
    const currentIncludes = form.getValues("includes");
    form.setValue("includes", [...currentIncludes, ""], { shouldValidate: true });
    // Trigger validation after adding
    setTimeout(() => {
      validateIncludes();
    }, 0);
  };

  const removeInclude = (index: number) => {
    const currentIncludes = form.getValues("includes");
    if (currentIncludes.length > 1) {
      form.setValue("includes", currentIncludes.filter((_, i) => i !== index), { shouldValidate: true });
      // Trigger validation after removing
      setTimeout(() => {
        validateIncludes();
      }, 0);
    }
  };

  // Custom validation for includes array
  const validateIncludes = () => {
    const includes = form.getValues("includes");
    const filteredIncludes = includes.filter((item: string) => item.trim() !== "");
    
    if (filteredIncludes.length === 0) {
      form.setError("includes", {
        type: "manual",
        message: "At least one include item is required"
      });
      return false;
    }
    
    form.clearErrors(["includes"]);
    return true;
  };

  // Force validation on form submission
  const handleSubmit = async (data: any) => {
    // Validate includes before submission
    if (!validateIncludes()) {
      return;
    }
    
    await onSubmit(data);
  };

  // Trigger validation when form is submitted
  const handleFormSubmit = form.handleSubmit(handleSubmit);
  const handleFormSubmitWithValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    // Force validation first
    validateIncludes();
    // Then proceed with form submission
    await handleFormSubmit(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmitWithValidation} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Car Name */}
          <FormField
            control={form.control}
            name="car_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter car name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Car Color */}
          <FormField
            control={form.control}
            name="car_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Color</FormLabel>
                <FormControl>
                  <Input placeholder="Enter car color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Police Number */}
          <FormField
            control={form.control}
            name="police_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Police Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter police number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transmission */}
          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                    <SelectItem value="AUTO">Automatic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max Persons */}
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

          {/* Price per Day */}
          <FormField
            control={form.control}
            name="price_per_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Day</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter price per day" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>



        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter car description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Includes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Car Includes</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInclude}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Include
            </Button>
          </div>
          
          {form.watch("includes").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`includes.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter include item" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          // Trigger validation after a short delay
                          setTimeout(() => {
                            validateIncludes();
                          }, 100);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInclude();
                          }
                        }}
                      />
                      {form.watch("includes").length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInclude(index)}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {form.formState.errors.includes && (
            <FormMessage>
              {form.formState.errors.includes.message}
            </FormMessage>
          )}
          {/* Debug: Show current includes state */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-2">
              Debug: Includes count: {form.watch("includes").filter((item: string) => item.trim() !== "").length}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Creating..." : (isEditing ? "Update Car" : "Create Car")}
          </Button>
        </div>
      </form>
    </Form>
  );
} 