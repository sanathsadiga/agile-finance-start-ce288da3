
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, User } from "lucide-react";
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/services/customerService';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';

interface CustomerSelectorProps {
  selectedCustomerId: number | null;
  onCustomerSelect: (customerId: number | null) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  selectedCustomerId,
  onCustomerSelect,
}) => {
  const { customers, isLoading, refetch } = useCustomers();
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleCustomerAdded = () => {
    refetch();
    setIsAddCustomerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Customer</label>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Customer</label>
      <div className="flex gap-2">
        <Select
          value={selectedCustomerId?.toString() || ""}
          onValueChange={(value) => onCustomerSelect(value ? parseInt(value) : null)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a customer">
              {selectedCustomer && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedCustomer.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-xs text-gray-500">{customer.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsAddCustomerOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {selectedCustomer && (
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Email:</span> {selectedCustomer.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {selectedCustomer.phone}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Address:</span> {selectedCustomer.address}
            </div>
          </div>
        </div>
      )}

      <AddCustomerDialog
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
};

export default CustomerSelector;
