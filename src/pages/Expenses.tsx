
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileMinus, Plus, FileUp, MoreHorizontal } from "lucide-react";

// Placeholder data
const expenses = [
  {
    id: "EXP-001",
    description: "Software Subscription",
    category: "Software",
    amount: "$49.99",
    date: "2023-04-22",
    receipt: true
  },
  {
    id: "EXP-002",
    description: "Office Supplies",
    category: "Office",
    amount: "$126.50",
    date: "2023-04-18",
    receipt: true
  },
  {
    id: "EXP-003",
    description: "Client Lunch",
    category: "Meals",
    amount: "$78.25",
    date: "2023-04-15",
    receipt: false
  },
  {
    id: "EXP-004",
    description: "Domain Renewal",
    category: "Software",
    amount: "$14.99",
    date: "2023-04-12",
    receipt: false
  },
  {
    id: "EXP-005",
    description: "Business Travel",
    category: "Travel",
    amount: "$350.00",
    date: "2023-04-08",
    receipt: true
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
  
  const handleAddExpense = () => {
    toast({
      title: "Feature not implemented",
      description: "Expense creation will be implemented in the future."
    });
  };
  
  const handleViewReceipt = (id: string) => {
    toast({
      title: "Feature not implemented",
      description: `Viewing receipt for expense ${id} will be implemented in the future.`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
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
            <CardTitle>All Expenses</CardTitle>
            <CardDescription>View and manage your expense records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Receipt</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FileMinus className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">{expense.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{expense.description}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(categories as any)[expense.category] || categories.Other}`}>
                          {expense.category}
                        </span>
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
                          <span className="text-gray-400 text-sm">No receipt</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="icon" title="More actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;
