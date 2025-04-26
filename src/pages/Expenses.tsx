
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileMinus, Plus, FileUp, MoreHorizontal, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DashboardHeader from '@/components/layout/DashboardHeader';
import ExpenseForm from '@/components/expenses/ExpenseForm';

// Placeholder data
const expenses = [
  {
    id: "EXP-001",
    description: "Software Subscription",
    category: "Software",
    amount: "$49.99",
    date: "2023-04-22",
    receipt: true,
    vendor: "Adobe Inc."
  },
  {
    id: "EXP-002",
    description: "Office Supplies",
    category: "Office",
    amount: "$126.50",
    date: "2023-04-18",
    receipt: true,
    vendor: "Office Depot"
  },
  {
    id: "EXP-003",
    description: "Client Lunch",
    category: "Meals",
    amount: "$78.25",
    date: "2023-04-15",
    receipt: false,
    vendor: "Olive Garden"
  },
  {
    id: "EXP-004",
    description: "Domain Renewal",
    category: "Software",
    amount: "$14.99",
    date: "2023-04-12",
    receipt: false,
    vendor: "GoDaddy"
  },
  {
    id: "EXP-005",
    description: "Business Travel",
    category: "Travel",
    amount: "$350.00",
    date: "2023-04-08",
    receipt: true,
    vendor: "Delta Airlines"
  }
];

// Categories with colors
const categories = {
  "Software": "bg-blue-100 text-blue-800",
  "Office": "bg-purple-100 text-purple-800",
  "Meals": "bg-green-100 text-green-800",
  "Travel": "bg-orange-100 text-orange-800",
  "Other": "bg-gray-100 text-gray-800"
};

const Expenses = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  
  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowExpenseForm(true);
  };
  
  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowExpenseForm(true);
  };
  
  const handleViewReceipt = (id: string) => {
    toast({
      title: "Viewing Receipt",
      description: `Viewing receipt for expense ${id}.`
    });
  };

  const handleCloseForm = () => {
    setShowExpenseForm(false);
  };

  const handleSaveExpense = (expenseData: any) => {
    toast({
      title: selectedExpense ? "Expense updated" : "Expense added",
      description: `Expense has been ${selectedExpense ? "updated" : "added"} successfully.`
    });
    setShowExpenseForm(false);
  };

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Meals">Meals</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vendor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Receipt</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FileMinus className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">{expense.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{expense.description}</td>
                      <td className="py-4 px-4">{expense.vendor}</td>
                      <td className="py-4 px-4">
                        <Badge className={(categories as any)[expense.category] || categories.Other}>
                          {expense.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-red-600">{expense.amount}</td>
                      <td className="py-4 px-4">{expense.date}</td>
                      <td className="py-4 px-4">
                        {expense.receipt ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center text-blue-600" 
                            onClick={() => handleViewReceipt(expense.id)}
                          >
                            <FileUp className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-gray-500"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Edit expense"
                          onClick={() => handleEditExpense(expense)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">No expenses found</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddExpense}>
                          <Plus className="mr-2 h-4 w-4" /> Add Expense
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default Expenses;
