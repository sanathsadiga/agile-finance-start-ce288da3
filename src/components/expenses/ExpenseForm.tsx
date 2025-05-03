
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, RotateCw, DollarSign, CreditCard, Wallet, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Expense } from '@/hooks/useExpenses';

interface ExpenseFormProps {
  expense?: Expense;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const paymentMethods = [
  { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { value: 'cash', label: 'Cash', icon: Wallet },
  { value: 'bank', label: 'Bank Transfer', icon: Landmark },
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onCancel, onSave }) => {
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [hasReceipt, setHasReceipt] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState('monthly');
  const [currency, setCurrency] = useState('usd');

  // Available categories with the option to add custom
  const [categories, setCategories] = useState([
    "Software", "Office", "Meals", "Travel", "Marketing", 
    "Utilities", "Rent", "Salaries", "Other"
  ]);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  useEffect(() => {
    if (expense) {
      setDescription(expense.description || '');
      setVendor(expense.vendor || '');
      setCategory(expense.category || '');
      setPaymentMethod(expense.payment_method || 'card');
      setAmount(expense.amount ? expense.amount.toString() : '');
      setNotes(expense.notes || '');
      setHasReceipt(expense.receipt || false);
      setIsRecurring(expense.is_recurring || false);
      setRecurrenceFrequency(expense.recurrence_frequency || 'monthly');
      setCurrency(expense.currency || 'usd');
      
      if (expense.date) {
        setDate(new Date(expense.date));
      }
      
      // Check if the expense category is in our list, if not add it
      if (expense.category && !categories.includes(expense.category)) {
        setCategories(prev => [...prev, expense.category]);
      }
    } else {
      resetForm();
    }
  }, [expense]);

  const resetForm = () => {
    setDescription('');
    setVendor('');
    setCategory('');
    setPaymentMethod('card');
    setAmount('');
    setDate(new Date());
    setNotes('');
    setReceiptFile(null);
    setHasReceipt(false);
    setIsRecurring(false);
    setRecurrenceFrequency('monthly');
    setCurrency('usd');
    setCustomCategory('');
    setShowCustomCategory(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
      setHasReceipt(true);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      setCategory('');
    } else {
      setShowCustomCategory(false);
      setCategory(value);
    }
  };

  const handleCustomCategoryAdd = () => {
    if (customCategory.trim()) {
      const newCategory = customCategory.trim();
      setCategories(prev => [...prev, newCategory]);
      setCategory(newCategory);
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      description,
      vendor,
      category,
      payment_method: paymentMethod,
      amount: parseFloat(amount),
      date: date ? format(date, 'yyyy-MM-dd') : null,
      notes,
      receipt: hasReceipt || !!receiptFile,
      is_recurring: isRecurring,
      recurrence_frequency: isRecurring ? recurrenceFrequency : null,
      currency
    };
    
    onSave(expenseData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          placeholder="Brief description of expense"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor/Merchant</Label>
          <Input 
            id="vendor" 
            placeholder="Who was paid"
            value={vendor} 
            onChange={(e) => setVendor(e.target.value)} 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={handleCategoryChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
              <SelectItem value="custom">+ Add Custom Category</SelectItem>
            </SelectContent>
          </Select>
          
          {showCustomCategory && (
            <div className="flex mt-2 gap-2">
              <Input 
                placeholder="Enter custom category" 
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleCustomCategoryAdd}>
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </span>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              min="0" 
              className="pl-9"
              placeholder="0.00"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                <div className="flex items-center">
                  {React.createElement(method.icon, { className: "mr-2 h-4 w-4" })}
                  <span>{method.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_recurring" 
          checked={isRecurring} 
          onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
        />
        <Label htmlFor="is_recurring" className="font-normal cursor-pointer">
          This is a recurring expense
        </Label>
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <Label htmlFor="recurrence_frequency">Recurring Frequency</Label>
          <Select value={recurrenceFrequency} onValueChange={setRecurrenceFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center">
            <RotateCw className="h-4 w-4 mr-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Future recurring expenses will be created automatically
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Receipt</Label>
        <div className="border rounded-md p-4 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            {!hasReceipt ? (
              <>
                <div className="border-2 border-dashed rounded-md p-6 w-full text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG and PDF up to 10MB</p>
                </div>
                <Input 
                  type="file" 
                  id="receipt" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                />
                <label htmlFor="receipt">
                  <Button type="button" variant="outline" className="mt-2" onClick={() => document.getElementById('receipt')?.click()}>
                    Select File
                  </Button>
                </label>
              </>
            ) : (
              <>
                <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-center">
                  <span className="mr-2">✓</span>
                  {receiptFile ? receiptFile.name : "Receipt attached"}
                </div>
                <Button type="button" variant="outline" onClick={() => {
                  setReceiptFile(null);
                  setHasReceipt(expense?.receipt || false);
                }}>
                  {expense?.receipt ? "Keep Original" : "Remove"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Any additional information (optional)" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{expense ? 'Update' : 'Add'} Expense</Button>
      </DialogFooter>
    </form>
  );
};

export default ExpenseForm;
