'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, ZoomIn } from 'lucide-react';

interface IdentityImagesZoomProps {
  identityImages: string[];
  imageLoadErrors: string[];
}

export default function IdentityImagesZoom({
  identityImages,
  imageLoadErrors,
}: IdentityImagesZoomProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsZoomOpen(true);
  };

  return (
    <>
      {/* Identity Image Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Identity Document
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-4">
          {identityImages.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {identityImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Identity Document ${index + 1}`}
                    className="max-h-48 w-auto object-contain rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => handleImageClick(image)}
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ZoomIn className="h-4 w-4 text-gray-700" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Click to zoom
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <User className="h-16 w-16 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No identity document available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Customer has not uploaded any identity documents
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Loading Errors */}
      {imageLoadErrors.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <User className="h-5 w-5" />
              Image Loading Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-amber-700">
                Some identity documents could not be loaded:
              </p>
              <ul className="list-disc list-inside text-sm text-amber-600 space-y-1">
                {imageLoadErrors.map((filename, index) => (
                  <li key={index} className="font-mono text-xs">
                    {filename}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                These files may have been deleted or are temporarily
                unavailable.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zoom Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="w-10/12 max-h-[90dvh]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Identity Document Full View"
                className="object-cover rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
