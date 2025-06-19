import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, Trash2, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceTemplates, InvoiceTemplate } from '@/hooks/useInvoiceTemplates';
import { useSettings } from '@/hooks/useSettings';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InvoiceTemplateManager from './InvoiceTemplateManager';
import CustomerSelector from './CustomerSelector';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceFormProps {
  invoice?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onCancel, onSave }) => {
  const navigate = useNavigate();
  const { templates, getDefaultTemplate, isLoading: templatesLoading } = useInvoiceTemplates();
  const { invoiceSettings, taxSettings, businessSettings } = useSettings();
  const { profileId, isLoading: profileLoading, error: profileError } = useBusinessProfile();

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('draft');
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);

  // Debug information
  useEffect(() => {
    console.log('InvoiceForm: Component mounted');
    console.log('InvoiceForm: Templates loading:', templatesLoading);
    console.log('InvoiceForm: Templates available:', templates.length);
    console.log('InvoiceForm: Invoice being edited:', invoice);
    console.log('InvoiceForm: Invoice settings:', invoiceSettings);
    console.log('InvoiceForm: Tax settings:', taxSettings);
    console.log('InvoiceForm: Business settings:', businessSettings);
  }, []);

  // Debug templates updates
  useEffect(() => {
    console.log('InvoiceForm: Templates updated:', templates.length, 'templates available');
    console.log('InvoiceForm: Templates loading state:', templatesLoading);
    
    // Set default template when templates load
    if (templates.length > 0 && !selectedTemplate && !templatesLoading) {
      const defaultTemplate = getDefaultTemplate();
      console.log('InvoiceForm: Setting default template:', defaultTemplate?.name);
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
      }
    }
  }, [templates, templatesLoading, selectedTemplate, getDefaultTemplate]);

  // Set due date based on invoice settings
  useEffect(() => {
    if (invoiceSettings && issueDate && !initialSetupDone) {
      console.log('InvoiceForm: Setting due date based on invoice settings');
      const paymentTerms = typeof invoiceSettings.default_payment_terms === 'number' 
        ? invoiceSettings.default_payment_terms 
        : parseInt(invoiceSettings.default_payment_terms || '30', 10);
      setDueDate(addDays(issueDate, paymentTerms));
    }
  }, [invoiceSettings, issueDate, initialSetupDone]);

  // Update due date when issue date changes (only after initial setup)
  useEffect(() => {
    if (initialSetupDone && issueDate && invoiceSettings) {
      console.log('InvoiceForm: Updating due date after issue date change');
      const paymentTerms = typeof invoiceSettings.default_payment_terms === 'number' 
        ? invoiceSettings.default_payment_terms 
        : parseInt(invoiceSettings.default_payment_terms || '30', 10);
      setDueDate(addDays(issueDate, paymentTerms));
    }
  }, [issueDate, initialSetupDone, invoiceSettings]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * (discountValue / 100)) 
    : discountValue;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxRate = taxSettings?.tax_enabled ? ((taxSettings?.default_tax_rate || 0) / 100) : 0;
  const taxAmount = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + taxAmount;

  // Handle template selection from the template manager
  const handleTemplateSelect = useCallback((template: InvoiceTemplate) => {
    console.log('InvoiceForm: Template selected:', template.name);
    setSelectedTemplate(template);
    setIsTemplateManagerOpen(false);
  }, []);

  useEffect(() => {
    if (!initialSetupDone) {
      console.log('InvoiceForm: Performing initial setup');
      if (invoice) {
        console.log('InvoiceForm: Setting up from existing invoice:', invoice);
        setCustomer(invoice.customer || '');
        setEmail(invoice.email || '');
        setStatus(invoice.status || 'draft');
        setNotes(invoice.notes || '');
        
        if (invoice.date) {
          setIssueDate(new Date(invoice.date));
        }
        
        if (invoice.dueDate) {
          setDueDate(new Date(invoice.dueDate));
        }
        
        if (invoice.items && invoice.items.length) {
          setItems(invoice.items);
        } else {
          // Initialize with a default empty item
          addItem();
        }
        
        // Set discount if available
        if (invoice.discount) {
          if (typeof invoice.discount === 'object') {
            setDiscountType(invoice.discount.type || 'percentage');
            setDiscountValue(invoice.discount.value || 0);
          }
        }
        
        // Set template if available
        if (invoice.template_id && templates.length > 0) {
          const template = templates.find(t => t.id === invoice.template_id);
          if (template) {
            setSelectedTemplate(template);
          }
        }
      } else {
        console.log('InvoiceForm: Setting up new invoice');
        // Initialize with a default empty item for new invoice
        addItem();

        // Set default notes from invoice settings
        if (invoiceSettings?.notes_default) {
          setNotes(invoiceSettings.notes_default);
        }
      }
      setInitialSetupDone(true);
      console.log('InvoiceForm: Initial setup complete');
    }
  }, [invoice, templates, invoiceSettings, initialSetupDone]);

  const addItem = () => {
    console.log('InvoiceForm: Adding new item');
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('InvoiceForm: Submitting form');
    
    if (!profileId) {
      console.error('No profile ID available');
      return;
    }

    if (!selectedCustomerId) {
      console.error('No customer selected');
      return;
    }

    // Format the request according to backend API
    const invoiceData = {
      profileId,
      customerId: selectedCustomerId,
      date: issueDate ? format(issueDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      notes: notes || undefined,
      lines: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.rate,
        taxRate: taxSettings?.tax_enabled ? (taxSettings?.default_tax_rate || 0) : 0
      }))
    };
    
    console.log('InvoiceForm: Prepared invoice data for backend:', invoiceData);
    onSave(invoiceData);
  };

  const openTemplateManager = () => {
    console.log('InvoiceForm: Opening template manager');
    setIsTemplateManagerOpen(true);
  };

  // Format currency display based on business settings
  const formatCurrency = (amount: number) => {
    const currencyCode = businessSettings?.default_currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    return formatter.format(amount);
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading business profile...</span>
      </div>
    );
  }

  if (profileError || !profileId) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {profileError || 'Business profile not found'}</p>
        <p className="text-sm mt-2">Please ensure your business profile is set up correctly.</p>
      </div>
    );
  }

  // Debug rendering
  console.log('InvoiceForm: Rendering with items:', items.length);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Invoice Details</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={openTemplateManager}
            size="sm"
          >
            <LayoutTemplate className="h-4 w-4 mr-2" />
            {selectedTemplate ? selectedTemplate.name : 'Choose Template'}
          </Button>
        </div>
      </div>

      <CustomerSelector
        selectedCustomerId={selectedCustomerId}
        onCustomerSelect={setSelectedCustomerId}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !issueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {issueDate ? format(issueDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={issueDate}
                onSelect={setIssueDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Invoice Items</Label>
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 text-xs font-medium text-gray-500">Description</th>
                <th className="text-center p-2 text-xs font-medium text-gray-500 w-20">Quantity</th>
                <th className="text-center p-2 text-xs font-medium text-gray-500 w-24">Rate</th>
                <th className="text-right p-2 text-xs font-medium text-gray-500 w-24">Amount</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="p-2">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      required
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      required
                      className="text-center"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      required
                      className="text-right"
                    />
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2">
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <div className="w-full md:w-1/3 flex justify-between">
          <span className="text-sm font-medium">Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        {taxSettings?.tax_enabled && (
          <div className="w-full md:w-1/3 flex justify-between">
            <span className="text-sm font-medium">{taxSettings.tax_name} ({taxSettings.default_tax_rate}%):</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
        )}
        <div className="w-full md:w-1/3 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Additional notes or payment instructions" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      
      <DialogFooter className="sticky bottom-0 pt-4 bg-white border-t -mx-6 px-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!selectedCustomerId}>
          Save Invoice
        </Button>
      </DialogFooter>

      {/* Template Manager Dialog */}
      <Dialog open={isTemplateManagerOpen} onOpenChange={setIsTemplateManagerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <InvoiceTemplateManager 
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setIsTemplateManagerOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default InvoiceForm;
