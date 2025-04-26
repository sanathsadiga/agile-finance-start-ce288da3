
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, MoreHorizontal, Plus, Search, Filter, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardHeader from '@/components/layout/DashboardHeader';
import InvoiceForm from '@/components/invoices/InvoiceForm';

// Placeholder data with more properties
const invoices = [
  {
    id: "INV-1234",
    customer: "Acme Inc.",
    email: "billing@acmeinc.com",
    amount: "$1,200.00",
    date: "2023-04-25",
    dueDate: "2023-05-25",
    status: "unpaid"
  },
  {
    id: "INV-1233",
    customer: "Globex Corp",
    email: "accounts@globexcorp.com",
    amount: "$2,500.00",
    date: "2023-04-20",
    dueDate: "2023-05-20",
    status: "paid"
  },
  {
    id: "INV-1232",
    customer: "Initech",
    email: "finance@initech.com",
    amount: "$750.00",
    date: "2023-04-15",
    dueDate: "2023-05-15",
    status: "paid"
  },
  {
    id: "INV-1231",
    customer: "Umbrella Corp",
    email: "payments@umbrellacorp.com",
    amount: "$3,000.00",
    date: "2023-04-10",
    dueDate: "2023-05-10",
    status: "overdue"
  },
  {
    id: "INV-1230",
    customer: "Stark Industries",
    email: "invoices@stark.com",
    amount: "$1,800.00",
    date: "2023-04-05",
    dueDate: "2023-05-05",
    status: "unpaid"
  }
];

const Invoices = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setShowInvoiceForm(true);
  };
  
  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleCloseForm = () => {
    setShowInvoiceForm(false);
  };

  const handleSaveInvoice = (invoiceData: any) => {
    toast({
      title: selectedInvoice ? "Invoice updated" : "Invoice created",
      description: `Invoice ${selectedInvoice ? selectedInvoice.id : "has been"} ${selectedInvoice ? "updated" : "created"} successfully.`
    });
    setShowInvoiceForm(false);
  };
  
  const handleDownload = (id: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${id}`
    });
  };

  const handleSendEmail = (id: string, email: string) => {
    toast({
      title: "Invoice sent",
      description: `Invoice ${id} has been sent to ${email}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>View, download, and manage your invoices</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search invoices..." 
                    className="pl-8 w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
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
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{invoice.customer}</p>
                          <p className="text-xs text-gray-500">{invoice.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">{invoice.amount}</td>
                      <td className="py-4 px-4">{invoice.date}</td>
                      <td className="py-4 px-4">{invoice.dueDate}</td>
                      <td className="py-4 px-4">
                        <Badge 
                          className={`${getStatusColor(invoice.status)} cursor-pointer transition-colors`}
                          onClick={() => {
                            if (invoice.status === 'unpaid') {
                              toast({ 
                                title: "Mark as paid?", 
                                description: `Would you like to mark invoice ${invoice.id} as paid?` 
                              });
                            }
                          }}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleSendEmail(invoice.id, invoice.email)}
                            title="Send email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownload(invoice.id)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="More actions"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No invoices found</p>
                        <Button variant="outline" className="mt-4" onClick={handleCreateInvoice}>
                          <Plus className="mr-2 h-4 w-4" /> Create Invoice
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

      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
            <DialogDescription>
              {selectedInvoice ? 'Edit your existing invoice details' : 'Fill out the form to create a new invoice'}
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm 
            invoice={selectedInvoice} 
            onCancel={handleCloseForm}
            onSave={handleSaveInvoice}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
