"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUploadTravelPackageImages } from "@/hooks/travel.hook";
import { convertTravelImageUrl } from "@/lib/helper/images-url";

interface TravelImagesFormProps {
  packageId: number;
  onBack?: () => void;
  isEditing?: boolean;
  existingImages?: string[];
}

export function TravelImagesForm({ packageId, onBack, isEditing = false, existingImages = [] }: TravelImagesFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length !== files.length) {
        toast.warning("Some files were skipped. Only image files are allowed.");
      }
      
      setImages(prev => [...prev, ...imageFiles]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length !== files.length) {
        toast.warning("Some files were skipped. Only image files are allowed.");
      }
      
      setImages(prev => [...prev, ...imageFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0 && existingImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsUploading(true);
    try {
      const response = await useUploadTravelPackageImages(packageId, images);
      if('errors' in response) {
        toast.error(response.errors?.message || "Failed to upload images");
        return;
      } else if('data' in response) {
        toast.success(isEditing ? "Images updated successfully!" : "Images uploaded successfully!");
      }
      // Redirect to travel packages page
      router.push("/travel-packages");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isEditing ? "Update Travel Package Images" : "Upload Travel Package Images"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Update images for your travel package. You can drag and drop new images or click to select."
            : "Upload images for your travel package. You can drag and drop images or click to select."
          }
        </p>
      </div>

      {/* Show existing images if editing */}
      {isEditing && existingImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Existing Images ({existingImages.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={convertTravelImageUrl(imageUrl)}
                      alt={`Existing Image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Existing Image {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isEditing ? "Drag and drop new images here" : "Drag and drop images here"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              Select Images
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">New Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isUploading || !onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isUploading || (images.length === 0 && existingImages.length === 0)}
        >
          {isUploading ? "Uploading..." : (isEditing ? "Update Images" : "Save Images")}
        </Button>
      </div>
    </div>
  );
} 