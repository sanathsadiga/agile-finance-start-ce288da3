
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileMinus, Plus, FileUp, MoreHorizontal, Search, Filter, Trash2, PenLine, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import DashboardHeader from '@/components/layout/DashboardHeader';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { useExpenses, Expense } from '@/hooks/useExpenses';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Categories with colors
const categories = {
  "Software": "bg-blue-100 text-blue-800",
  "Office": "bg-purple-100 text-purple-800",
  "Meals": "bg-green-100 text-green-800",
  "Travel": "bg-orange-100 text-orange-800",
  "Marketing": "bg-yellow-100 text-yellow-800",
  "Utilities": "bg-indigo-100 text-indigo-800",
  "Rent": "bg-pink-100 text-pink-800",
  "Salaries": "bg-cyan-100 text-cyan-800",
  "Other": "bg-gray-100 text-gray-800"
};

// Payment method icons and colors
const paymentMethods = {
  "card": { color: "bg-blue-50 text-blue-800", icon: <FileMinus className="h-4 w-4" /> },
  "cash": { color: "bg-green-50 text-green-800", icon: <FileMinus className="h-4 w-4" /> },
  "bank": { color: "bg-amber-50 text-amber-800", icon: <FileMinus className="h-4 w-4" /> },
};

const Expenses = () => {
  const { toast } = useToast();
  const { expenses, isLoading, fetchExpenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowExpenseForm(true);
  };
  
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowExpenseForm(true);
  };
  
  const handleViewReceipt = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense?.receipt_url) {
      window.open(expense.receipt_url, '_blank');
    } else {
      toast({
        title: "Receipt Not Available",
        description: "This expense doesn't have a viewable receipt.",
        variant: "destructive"
      });
    }
  };

  const handleCloseForm = () => {
    setShowExpenseForm(false);
  };

  const handleSaveExpense = async (expenseData: any) => {    
    try {
      if (selectedExpense) {
        await updateExpense({ 
          ...expenseData, 
          id: selectedExpense.id 
        });
        toast({
          title: "Expense updated",
          description: "Your expense has been updated successfully."
        });
      } else {
        await addExpense(expenseData);
        toast({
          title: "Expense added",
          description: "New expense has been added successfully."
        });
      }
      setShowExpenseForm(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Operation failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    
    try {
      await deleteExpense(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting this expense.",
        variant: "destructive"
      });
    }
  };

  // Get all unique categories from expenses for dynamic filters
  const uniqueCategories = React.useMemo(() => {
    return Array.from(new Set(expenses.map(expense => expense.category)));
  }, [expenses]);

  // Filter expenses based on search, category and date range
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      // Search term filter (case insensitive)
      const matchesSearch = 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        expense.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      // Date range filter
      let matchesDateRange = true;
      const today = new Date();
      const expenseDate = parseISO(expense.date);
      
      if (dateRangeFilter === 'today') {
        matchesDateRange = format(expenseDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      } else if (dateRangeFilter === 'this-week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        matchesDateRange = expenseDate >= startOfWeek;
      } else if (dateRangeFilter === 'this-month') {
        matchesDateRange = 
          expenseDate.getMonth() === today.getMonth() && 
          expenseDate.getFullYear() === today.getFullYear();
      } else if (dateRangeFilter === 'this-year') {
        matchesDateRange = expenseDate.getFullYear() === today.getFullYear();
      }
      
      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [expenses, searchTerm, categoryFilter, dateRangeFilter]);

  // Pagination logic
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateRangeFilter('all');
    setPage(1);
  };

  // Format date from YYYY-MM-DD to display format
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  // Get category style - if not found in predefined categories, use a default
  const getCategoryStyle = (category: string) => {
    return (categories as any)[category] || 'bg-gray-100 text-gray-800';
  };

  // Get payment method style and icon
  const getPaymentMethodInfo = (method: string) => {
    return (paymentMethods as any)[method] || { color: "bg-gray-50 text-gray-800", icon: <FileMinus className="h-4 w-4" /> };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600">Track your business expenses</p>
          </div>
          <Button onClick={handleAddExpense}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>View and manage your expense records</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search expenses..." 
                    className="pl-8 w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                {(searchTerm || categoryFilter !== 'all' || dateRangeFilter !== 'all') && (
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((expense) => (
                        <TableRow key={expense.id} className="hover:bg-gray-50">
                          <TableCell>{formatDate(expense.date)}</TableCell>
                          <TableCell>
                            <div className="font-medium">{expense.description}</div>
                            {expense.is_recurring && (
                              <Badge variant="outline" className="mt-1">
                                <RotateCw className="h-3 w-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{expense.vendor || '-'}</TableCell>
                          <TableCell>
                            <Badge className={getCategoryStyle(expense.category)}>
                              {expense.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPaymentMethodInfo(expense.payment_method).color}`}>
                              {getPaymentMethodInfo(expense.payment_method).icon}
                              <span className="ml-1 capitalize">{expense.payment_method}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${typeof expense.amount === 'number' ? expense.amount.toFixed(2) : expense.amount}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" title="Expense actions">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                                  <PenLine className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {expense.receipt && (
                                  <DropdownMenuItem onClick={() => handleViewReceipt(expense.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Receipt
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => setConfirmDeleteId(expense.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {currentItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No expenses found</p>
                            <Button variant="outline" className="mt-4" onClick={handleAddExpense}>
                              <Plus className="mr-2 h-4 w-4" /> Add Expense
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
            <DialogDescription>
              {selectedExpense ? 'Edit your expense details' : 'Fill out the form to record a new expense'}
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm 
            expense={selectedExpense} 
            onCancel={handleCloseForm}
            onSave={handleSaveExpense}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expenses;
