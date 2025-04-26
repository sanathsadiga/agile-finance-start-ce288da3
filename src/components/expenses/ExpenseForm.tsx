
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
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  expense?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onCancel, onSave }) => {
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [hasReceipt, setHasReceipt] = useState(false);

  useEffect(() => {
    if (expense) {
      setDescription(expense.description || '');
      setVendor(expense.vendor || '');
      setCategory(expense.category || '');
      setAmount(expense.amount ? expense.amount.replace(/[^\d.]/g, '') : ''); // Remove $ from the amount
      setNotes(expense.notes || '');
      setHasReceipt(expense.receipt || false);
      
      if (expense.date) {
        setDate(new Date(expense.date));
      }
    } else {
      resetForm();
    }
  }, [expense]);

  const resetForm = () => {
    setDescription('');
    setVendor('');
    setCategory('');
    setAmount('');
    setDate(new Date());
    setNotes('');
    setReceiptFile(null);
    setHasReceipt(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
      setHasReceipt(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      description,
      vendor,
      category,
      amount: `$${parseFloat(amount).toFixed(2)}`,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      notes,
      receipt: hasReceipt || !!receiptFile
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
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Meals">Meals</SelectItem>
              <SelectItem value="Travel">Travel</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Salaries">Salaries</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              min="0" 
              className="pl-7"
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
