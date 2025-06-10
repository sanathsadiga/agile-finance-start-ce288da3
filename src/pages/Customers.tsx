
import React from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Customers = () => {
  const handleCreateNewUser = () => {
    console.log('Create new user clicked');
    // This will be implemented later with backend integration
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-2">Manage your customer database</p>
          </div>
          <Button onClick={handleCreateNewUser} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New User
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500 text-center">
            Customer management features will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Customers;
