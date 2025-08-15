'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye,
  Users,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Edit,
  Trash2,
  MoreVertical,
  Car,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Car as CarInterface } from '@/interfaces';
import { Meta } from '@/interfaces';
import Image from 'next/image';
import { useDeleteCar } from '@/hooks/cars.hook';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { convertCarImageUrl } from '@/lib/helper/images-url';

interface CarsTableProps {
  cars: CarInterface[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

export function CarsTable({
  cars,
  meta,
  loading,
  onPageChange,
  onRefetch,
}: CarsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<CarInterface | null>(null);

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleDeleteClick = (car: CarInterface) => {
    setCarToDelete(car);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return;

    try {
      const response = await useDeleteCar(carToDelete.id);
      toast.success('Car deleted successfully!');
      onRefetch();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  const handleEdit = (id: number) => {
    redirect(`/cars/edit/${id}`);
  };

  const truncateDescription = (description: string, maxWords: number = 8) => {
    const words = description.split(' ');
    if (words.length <= maxWords) {
      return description;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-full mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded w-full mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Car Name</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Max Persons</TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Police Number</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No cars found.
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <React.Fragment key={car.id}>
                  <TableRow className="hover:bg-muted/50 ">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(car.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(car.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{car.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{car.car_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {truncateDescription(car.description)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatPrice(car.price_per_day)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>{car.max_persons}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{car.transmission}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="font-mono text-sm">
                          {car.police_number}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right w-[120px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>{car.car_name}</DialogTitle>
                                <DialogDescription>
                                  View detailed information about this car.
                                </DialogDescription>
                              </DialogHeader>
                              <ScrollArea className="max-h-[60vh]">
                                <CarDetails car={car} />
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenuItem onClick={() => handleEdit(car.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(car)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(car.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Car Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Color:</span>{' '}
                                    {car.car_color}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Police Number:
                                    </span>{' '}
                                    {car.police_number}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Transmission:
                                    </span>{' '}
                                    {car.transmission}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Includes</h4>
                                <div className="flex flex-wrap gap-1">
                                  {car.includes.map((item, index) => (
                                    <Badge key={index} variant="outline">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(meta.currentPage - 1) * meta.limit + 1} to{' '}
            {Math.min(meta.currentPage * meta.limit, meta.totalItems)} of{' '}
            {meta.totalItems} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    meta.hasPrevPage && onPageChange(meta.currentPage - 1)
                  }
                  className={
                    !meta.hasPrevPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {[...Array(meta.totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === meta.currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    meta.hasNextPage && onPageChange(meta.currentPage + 1)
                  }
                  className={
                    !meta.hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{carToDelete?.car_name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CarDetails({ car }: { car: CarInterface }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Car Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Price per Day:</span>{' '}
            {formatPrice(car.price_per_day)}
          </div>
          <div>
            <span className="font-medium">Max Persons:</span> {car.max_persons}
          </div>
          <div>
            <span className="font-medium">Color:</span> {car.car_color}
          </div>
          <div>
            <span className="font-medium">Transmission:</span>{' '}
            {car.transmission}
          </div>
          <div>
            <span className="font-medium">Police Number:</span>{' '}
            {car.police_number}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground">{car.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Car Includes</h3>
        <div className="flex flex-wrap gap-2">
          {car.includes.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {car.car_image && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Car Image</h3>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Image
              src={convertCarImageUrl(car.car_image)}
              alt="Car Image"
              width={450}
              height={300}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {formatDate(car.created_at)}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {formatDate(car.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
