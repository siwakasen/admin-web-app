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
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  MoreVertical,
  Receipt,
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
import { Expense } from '@/interfaces/expenses.interface';
import { Meta } from '@/interfaces';
import { useDeleteExpense } from '@/hooks/expenses.hook';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface ExpensesTableProps {
  expenses: Expense[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

export function ExpensesTable({
  expenses,
  meta,
  loading,
  onPageChange,
  onRefetch,
}: ExpensesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    try {
      const response = await useDeleteExpense(expenseToDelete.id);
      if ('errors' in response) {
        toast.error(response.errors?.message || 'Failed to delete expense');
      } else {
        toast.success('Expense deleted successfully!');
        onRefetch();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    } finally {
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleEdit = (id: number) => {
    redirect(`/expenses/edit/${id}`);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded" />
          <div className="space-y-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No expenses found
        </h3>
        <p className="text-muted-foreground">
          Get started by creating your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Expense Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(expense.id)}
                    >
                      {expandedRows.has(expense.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {expense.expense_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {formatAmount(expense.expense_amount)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(expense.expense_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(expense.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleRowExpansion(expense.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(expense.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(expense)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRows.has(expense.id) && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <ExpenseDetails expense={expense} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(meta.currentPage - 1)}
                className={
                  !meta.hasPrevPage
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={page === meta.currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(meta.currentPage + 1)}
                className={
                  !meta.hasNextPage
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{expenseToDelete?.expense_name}"?
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

function ExpenseDetails({ expense }: { expense: Expense }) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="m-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                Expense Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm font-medium">
                    {expense.expense_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatAmount(expense.expense_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium">
                    {formatDate(expense.expense_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                System Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Created:
                  </span>
                  <span className="text-sm font-medium">
                    {formatDateTime(expense.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Updated:
                  </span>
                  <span className="text-sm font-medium">
                    {formatDateTime(expense.updated_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Created By:
                  </span>
                  <span className="text-sm font-medium">
                    Employee ID: {expense.created_by}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
