"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { convertCarImageUrl } from "@/lib/helper/images-url";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CarsImageFormProps {
  carId: number;
  onBack?: () => void;
  isEditing?: boolean;
  existingImage?: string;
  onRefetch: () => void;
}

export function CarsImageForm({ carId, onBack, isEditing = false, existingImage, onRefetch }: CarsImageFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
      } else {
        toast.warning("Please select an image file.");
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
      } else {
        toast.warning("Please select an image file.");
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage && !existingImage) {
      toast.error("Please select an image");
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Call your upload car image hook here
      // const response = await useUploadCarImage(carId, selectedImage);
      toast.success(isEditing ? "Image updated successfully!" : "Image uploaded successfully!");
      onRefetch();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteImage = async () => {
    try {
      // TODO: Call your delete car image hook here
      // const response = await useDeleteCarImage(carId);
      toast.success("Image deleted successfully!");
      setDeleteDialogOpen(false);
      onRefetch();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isEditing ? "Update Car Image" : "Upload Car Image"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Update image for your car. You can drag and drop a new image or click to select."
            : "Upload image for your car. You can drag and drop an image or click to select."
          }
        </p>
      </div>

      {/* Show existing image if editing */}
      {isEditing && existingImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Existing Image</h3>
          <div className="relative group">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={convertCarImageUrl(existingImage)}
                  alt="Existing car image"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteImage}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-1">
              Existing car image
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteImage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              {isEditing ? "Drag and drop new image here" : "Drag and drop image here"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("car-image-input")?.click()}
            >
              Select Image
            </Button>
            <input
              id="car-image-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {selectedImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">New Image</h3>
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected car image"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedImage.name}
            </p>
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
          disabled={isUploading || (!selectedImage && !existingImage)}
          className="cursor-pointer"
        >
          {isUploading ? "Uploading..." : (isEditing ? "Update Image" : "Save Image")}
        </Button>
      </div>
    </div>
  );
} 