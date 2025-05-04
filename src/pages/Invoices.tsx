
import React from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Template, FileText, Plus } from 'lucide-react';

const Invoices = () => {
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
                <Template className="h-4 w-4 mr-2" />
                Manage Templates
              </Link>
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Invoice list goes here */}
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300">
          <Plus className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No invoices yet. Create your first invoice!</p>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
