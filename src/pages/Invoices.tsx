import React, { useEffect, useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileEdit, FileText, Plus, Search, X } from 'lucide-react';
import { useInvoices, Invoice } from '@/hooks/useInvoices';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { CreateInvoiceResponse } from '@/services/invoiceService';

const Invoices = () => {
  const navigate = useNavigate();
  const { rawInvoices, isLoading, fetchInvoices, addInvoice, searchInvoice, searchResults, isSearching, clearSearch } = useInvoices();
  const { invoiceSettings, businessSettings } = useSettings();
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const itemsPerPage = 6;
  
  // Use search results if available, otherwise use all invoices
  const displayInvoices = searchResults ? [searchResults] : rawInvoices;
  const totalPages = Math.ceil(displayInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = displayInvoices.slice(startIndex, endIndex);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Format the search query to match backend expectation (INV-XXXXX)
      const formattedQuery = searchQuery.toUpperCase().startsWith('INV-') 
        ? searchQuery.toUpperCase() 
        : `INV-${searchQuery}`;
      
      await searchInvoice(formattedQuery);
      setCurrentPage(1); // Reset to first page when searching
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
    setCurrentPage(1);
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const newInvoice = await addInvoice({
        ...invoiceData,
        amount: invoiceData.total,
      });
      setIsCreatingInvoice(false);
      toast({
        title: "Invoice created",
        description: "Your invoice has been created successfully.",
      });
      
      if (newInvoice && newInvoice.id) {
        navigate(`/dashboard/invoices/${newInvoice.id}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Failed to create invoice",
        description: "There was a problem creating your invoice.",
        variant: "destructive",
      });
    }
  };

  const handleInvoiceClick = (publicId: string) => {
    if (publicId) {
      console.log("Navigating to invoice detail:", publicId);
      navigate(`/dashboard/invoices/${publicId}`);
    } else {
      console.error("Invalid invoice ID");
      toast({
        title: "Error",
        description: "Could not open invoice details - invalid ID",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500">Sent</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-500">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currencyCode: string = businessSettings?.default_currency || 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    return formatter.format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Create and manage your invoices</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <Button asChild variant="outline">
              <Link to="/dashboard/templates">
                <FileEdit className="h-4 w-4 mr-2" />
                Manage Templates
              </Link>
            </Button>
            <Button onClick={() => setIsCreatingInvoice(true)}>
              <FileText className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by invoice number (e.g., INV-14890)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {searchResults && (
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
          {searchResults && (
            <p className="text-sm text-gray-600 mt-2">
              Found 1 result for "{searchQuery}"
            </p>
          )}
        </div>

        {isLoading || isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : currentInvoices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentInvoices.map((invoice: CreateInvoiceResponse) => (
                <div 
                  key={invoice.publicId}
                  onClick={() => handleInvoiceClick(invoice.publicId)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">
                            {invoice.invoiceNumber}
                          </h3>
                          <p className="text-sm text-gray-500">{invoice.customer.name}</p>
                        </div>
                        <div>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Email:</span>
                          <span className="truncate ml-2">{invoice.customer.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Phone:</span>
                          <span>{invoice.customer.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end border-t pt-4">
                        <div className="text-sm text-gray-500">
                          {format(new Date(invoice.date), 'MMM d, yyyy')}
                        </div>
                        <div className="font-bold text-lg">
                          {formatCurrency(invoice.total)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300">
            <Plus className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">
              {searchResults === null ? 'No invoices yet. Create your first invoice!' : 'No invoice found with that number.'}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isCreatingInvoice} onOpenChange={setIsCreatingInvoice}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm 
            onSave={handleCreateInvoice}
            onCancel={() => setIsCreatingInvoice(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
