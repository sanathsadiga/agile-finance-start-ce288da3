
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, MoreHorizontal, Plus } from "lucide-react";

// Placeholder data
const invoices = [
  {
    id: "INV-1234",
    customer: "Acme Inc.",
    amount: "$1,200.00",
    date: "2023-04-25",
    dueDate: "2023-05-25",
    status: "unpaid"
  },
  {
    id: "INV-1233",
    customer: "Globex Corp",
    amount: "$2,500.00",
    date: "2023-04-20",
    dueDate: "2023-05-20",
    status: "paid"
  },
  {
    id: "INV-1232",
    customer: "Initech",
    amount: "$750.00",
    date: "2023-04-15",
    dueDate: "2023-05-15",
    status: "paid"
  },
  {
    id: "INV-1231",
    customer: "Umbrella Corp",
    amount: "$3,000.00",
    date: "2023-04-10",
    dueDate: "2023-05-10",
    status: "overdue"
  },
  {
    id: "INV-1230",
    customer: "Stark Industries",
    amount: "$1,800.00",
    date: "2023-04-05",
    dueDate: "2023-05-05",
    status: "unpaid"
  }
];

const Invoices = () => {
  const { toast } = useToast();
  
  const handleCreateInvoice = () => {
    toast({
      title: "Feature not implemented",
      description: "Invoice creation will be implemented in the future."
    });
  };
  
  const handleDownload = (id: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${id}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Manage your customer invoices</p>
          </div>
          <Button onClick={handleCreateInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>View, download, and manage your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{invoice.customer}</td>
                      <td className="py-4 px-4">{invoice.amount}</td>
                      <td className="py-4 px-4">{invoice.date}</td>
                      <td className="py-4 px-4">{invoice.dueDate}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDownload(invoice.id)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
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

export default Invoices;
