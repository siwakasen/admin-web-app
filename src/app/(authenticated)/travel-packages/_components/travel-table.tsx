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
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DeleteTravelPackageResponse,
  TravelPackages,
} from '@/interfaces/travel.interface';
import { Meta } from '@/interfaces';
import Image from 'next/image';
import { useDeleteTravelPackage } from '@/hooks/travel.hook';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { convertTravelImageUrl } from '@/lib/helper/images-url';

interface TravelPackagesTableProps {
  packages: TravelPackages[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

export function TravelPackagesTable({
  packages,
  meta,
  loading,
  onPageChange,
  onRefetch,
}: TravelPackagesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<TravelPackages | null>(
    null
  );
  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleDeleteClick = (pkg: TravelPackages) => {
    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!packageToDelete) return;

    try {
      const response:
        | DeleteTravelPackageResponse
        | { status?: number; errors?: any } = await useDeleteTravelPackage(
        packageToDelete.id
      );
      if ('errors' in response) {
        toast.error(
          response.errors?.message || 'Failed to delete travel package'
        );
      } else if ('data' in response) {
        toast.success('Travel package deleted successfully!');
        onRefetch();
      }
    } catch (error) {
      console.error('Error deleting travel package:', error);
      toast.error('Failed to delete travel package. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPackageToDelete(null);
  };

  const handleEdit = (id: number) => {
    redirect(`/travel-packages/edit/${id}`);
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
              <TableHead>Package Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Max Persons</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No travel packages found.
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <React.Fragment key={pkg.id}>
                  <TableRow className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(pkg.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(pkg.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{pkg.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{pkg.package_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {truncateDescription(pkg.description)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatPrice(pkg.package_price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{pkg.duration} hours</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>{pkg.max_persons}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4 text-orange-600" />
                        <Badge variant="secondary">
                          {pkg.images?.length} images
                        </Badge>
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
                                <DialogTitle>{pkg.package_name}</DialogTitle>
                                <DialogDescription>
                                  View detailed information about this travel
                                  package.
                                </DialogDescription>
                              </DialogHeader>
                              <ScrollArea className="max-h-[60vh]">
                                <PackageDetails package={pkg} />
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenuItem onClick={() => handleEdit(pkg.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(pkg)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(pkg.id) && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Itineraries
                                </h4>
                                <ul className="space-y-1">
                                  {pkg.itineraries.map((item, index) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-start gap-2"
                                    >
                                      <span className="text-muted-foreground flex-shrink-0">
                                        •
                                      </span>
                                      <span className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Includes</h4>
                                <div className="flex flex-wrap gap-1">
                                  {pkg.includes.map((item, index) => (
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
            <DialogTitle>Delete Travel Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{packageToDelete?.package_name}"?
              This action cannot be undone.
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

function PackageDetails({ package: pkg }: { package: TravelPackages }) {
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
        <h3 className="text-lg font-semibold mb-2">Package Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Price:</span>{' '}
            {formatPrice(pkg.package_price)}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {pkg.duration} days
          </div>
          <div>
            <span className="font-medium">Max Persons:</span> {pkg.max_persons}
          </div>
          <div>
            <span className="font-medium">Images:</span> {pkg.images?.length}{' '}
            photos
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
        <ul className="space-y-2">
          {pkg.itineraries.map((item, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <span className="font-medium text-primary">{index + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Package Includes</h3>
        <div className="flex flex-wrap gap-2">
          {pkg.includes.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {pkg.images?.map((image, index) => (
            <div
              key={index}
              className="aspect-video bg-muted rounded-lg  flex items-center justify-center"
            >
              <Image
                src={convertTravelImageUrl(image)}
                alt="Travel Package Image"
                width={100}
                height={100}
                className="object-cover rounded-lg w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {formatDate(pkg.created_at)}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {formatDate(pkg.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
