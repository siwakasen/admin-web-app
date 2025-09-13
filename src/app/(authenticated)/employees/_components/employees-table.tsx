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
  User,
  Mail,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  MoreVertical,
  ShieldUser,
  Crown,
  Car,
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
import { Employee } from '@/interfaces/employees.interface';
import { Meta } from '@/interfaces';
import { redirect, useRouter } from 'next/navigation';
import { useDeleteEmployee } from '@/hooks';
import { toast } from 'sonner';

interface EmployeesTableProps {
  employees: Employee[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

export function EmployeesTable({
  employees,
  meta,
  loading,
  onPageChange,
  onRefetch,
}: EmployeesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const router = useRouter();

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };
  const handleEditEmployee = (id: number) => {
    redirect(`/employees/edit/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await useDeleteEmployee(employeeToDelete.id);
      if ('errors' in response) {
        toast.error(response.errors.message);
      }
      if ('message' in response) {
        toast.success(response.message);
        onRefetch();
      }
    } catch (error) {
      toast.error('Failed to delete employee. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleEdit = (id: number) => {
    router.push(`/employees/edit/${id}`);
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(salary);
  };

  const formatRoleName = (roleName: string) => {
    return roleName.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Last Password Update</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <React.Fragment key={employee.id}>
                  <TableRow className="hover:bg-muted/50 ">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(employee.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(employee.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{employee.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {employee.role.id === 1 ? (
                          <Crown className="h-4 w-4 text-yellow-600" />
                        ) : employee.role.id === 2 ? (
                          <ShieldUser className="h-4 w-4 text-green-600" />
                        ) : employee.role.id === 3 ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Car className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant="secondary">
                          {formatRoleName(employee.role.role_name)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-600">
                          {formatSalary(employee.salary)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {employee.last_update_password
                          ? formatDate(employee.last_update_password)
                          : 'N/A'}
                      </span>
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
                                <DialogTitle>{employee.name}</DialogTitle>
                                <DialogDescription>
                                  View detailed information about this employee.
                                </DialogDescription>
                              </DialogHeader>
                              <ScrollArea className="max-h-[60vh]">
                                <EmployeeDetails employee={employee} />
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenuItem
                            onClick={() => handleEdit(employee.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(employee)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(employee.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Employee Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Email:</span>{' '}
                                    {employee.email}
                                  </div>
                                  <div>
                                    <span className="font-medium">Role:</span>{' '}
                                    {employee.role.role_name}
                                  </div>
                                  <div>
                                    <span className="font-medium">Salary:</span>{' '}
                                    {formatSalary(employee.salary)}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Timestamps
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Created:
                                    </span>{' '}
                                    {formatDate(employee.created_at)}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Updated:
                                    </span>{' '}
                                    {formatDate(employee.updated_at)}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Last Password Update:
                                    </span>{' '}
                                    {employee.last_update_password
                                      ? formatDate(
                                          employee.last_update_password
                                        )
                                      : 'N/A'}
                                  </div>
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
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{employeeToDelete?.name}"? This
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

function EmployeeDetails({ employee }: { employee: Employee }) {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(salary);
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
        <h3 className="text-lg font-semibold mb-2">Employee Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {employee.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {employee.email}
          </div>
          <div>
            <span className="font-medium">Role:</span> {employee.role.role_name}
          </div>
          <div>
            <span className="font-medium">Salary:</span>{' '}
            {formatSalary(employee.salary)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Timestamps</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {formatDate(employee.created_at)}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {formatDate(employee.updated_at)}
          </div>
          <div>
            <span className="font-medium">Last Password Update:</span>{' '}
            {employee.last_update_password
              ? formatDate(employee.last_update_password)
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
