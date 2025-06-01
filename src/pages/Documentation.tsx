
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, FileText, Code, Lightbulb } from 'lucide-react';

// Mock documentation data
const mockDocs = [
  {
    id: '1',
    title: 'Getting Started with FinanceFlow',
    category: 'Getting Started',
    content: 'Learn how to set up your account and create your first invoice...',
    tags: ['beginner', 'setup', 'tutorial'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Invoice Management Guide',
    category: 'Invoices',
    content: 'Complete guide to creating, editing, and managing invoices...',
    tags: ['invoices', 'billing', 'guide'],
    lastUpdated: '2024-01-12'
  },
  {
    id: '3',
    title: 'Expense Tracking Tutorial',
    category: 'Expenses',
    content: 'How to track and categorize your business expenses...',
    tags: ['expenses', 'tracking', 'categories'],
    lastUpdated: '2024-01-10'
  },
  {
    id: '4',
    title: 'API Integration',
    category: 'API',
    content: 'Integrate FinanceFlow with your existing systems using our API...',
    tags: ['api', 'integration', 'developers'],
    lastUpdated: '2024-01-08'
  }
];

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [docs, setDocs] = useState(mockDocs);

  const categories = ['All', 'Getting Started', 'Invoices', 'Expenses', 'API'];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started':
        return <Lightbulb className="h-4 w-4" />;
      case 'Invoices':
        return <FileText className="h-4 w-4" />;
      case 'Expenses':
        return <BookOpen className="h-4 w-4" />;
      case 'API':
        return <Code className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about using FinanceFlow
            </p>
            
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  {getCategoryIcon(category)}
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getCategoryIcon(doc.category)}
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Updated {new Date(doc.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {doc.content}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documentation found</h3>
              <p className="text-gray-600">
                Try adjusting your search or browse different categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
