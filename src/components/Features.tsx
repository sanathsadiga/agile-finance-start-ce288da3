
import React from 'react';
import { 
  BarChart3, 
  FileText, 
  FileMinus, 
  BarChart, 
  Users, 
  Settings 
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="h-10 w-10 text-brand-purple" />,
    title: "Dashboard",
    description: "Get a quick overview of your financial status with an intuitive dashboard showing income, expenses, and outstanding invoices."
  },
  {
    icon: <FileText className="h-10 w-10 text-brand-purple" />,
    title: "Invoicing",
    description: "Create, send, and track professional invoices. Download as PDF and automatically mark as paid when you receive payment."
  },
  {
    icon: <FileMinus className="h-10 w-10 text-brand-purple" />,
    title: "Expenses",
    description: "Record and categorize your expenses. Attach receipts to keep your records organized and audit-ready."
  },
  {
    icon: <BarChart className="h-10 w-10 text-brand-purple" />,
    title: "Reports",
    description: "Generate profit & loss statements, expense breakdowns, and track your income over time with beautiful visualizations."
  },
  {
    icon: <Users className="h-10 w-10 text-brand-purple" />,
    title: "Team Management",
    description: "Create your organization profile and invite team members to collaborate on your finances with customizable permissions."
  },
  {
    icon: <Settings className="h-10 w-10 text-brand-purple" />,
    title: "Settings",
    description: "Configure your business details, select your preferred currency, and set up tax configurations to match your needs."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All the tools you need to manage your business finances in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
