
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  section: string;
  order_index: number;
}

export default function DocumentationPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>([]);

  // Fetch documentation from database
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Fetch documentation items ordered by category and order_index
        const { data, error } = await supabase
          .from('documentation')
          .select('*')
          .order('category')
          .order('order_index');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setDocs(data as DocItem[]);
          setSelectedDoc(data[0] as DocItem);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map((doc: any) => doc.category)));
          setCategories(uniqueCategories as string[]);
        }
        
      } catch (error) {
        console.error('Error fetching documentation:', error);
        // Fallback to sample data if database fetch fails
        const fallbackDocs = [
          {
            id: '1',
            title: 'Getting Started with FinanceFlow',
            slug: 'getting-started',
            content: '# Getting Started\n\nThis document will help you get started with our platform. It covers everything from setting up your account to making your first transaction.',
            category: 'Getting Started',
            section: 'User Guide',
            order_index: 1
          },
          {
            id: '2',
            title: 'API Documentation',
            slug: 'api-documentation',
            content: '# API Documentation\n\nThe API documentation provides all the details you need to integrate with our system. It includes all available endpoints and usage examples.',
            category: 'API',
            section: 'Developer',
            order_index: 1
          },
          {
            id: '3',
            title: 'FAQs',
            slug: 'faqs',
            content: '# FAQs\n\nFind answers to the most frequently asked questions by users. From account-related queries to troubleshooting steps.',
            category: 'Support',
            section: 'Help',
            order_index: 1
          },
          {
            id: '4',
            title: 'Best Practices',
            slug: 'best-practices',
            content: '# Best Practices\n\nThis document provides tips and recommendations on using our platform most effectively and efficiently.',
            category: 'Getting Started',
            section: 'User Guide',
            order_index: 2
          },
          {
            id: '5',
            title: 'Release Notes',
            slug: 'release-notes',
            content: '# Release Notes\n\nStay updated on the latest updates, features, and fixes that have been released.',
            category: 'Support',
            section: 'Help',
            order_index: 2
          }
        ];
        
        setDocs(fallbackDocs);
        setSelectedDoc(fallbackDocs[0]);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(fallbackDocs.map(doc => doc.category)));
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocs();
  }, []);

  // Filter docs based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = docs.filter(doc => 
        doc.title.toLowerCase().includes(lowercaseQuery) ||
        doc.content.toLowerCase().includes(lowercaseQuery) ||
        doc.category.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(docs);
    }
  }, [searchQuery, docs]);

  // Function to render markdown content
  const renderMarkdown = (content: string) => {
    // This is a simple implementation - for production, use a proper markdown renderer
    const htmlContent = content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-5">$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
      
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Helmet>
        <title>FinanceFlow - Documentation</title>
        <meta name="description" content="Explore the documentation to get detailed information about using the platform." />
        <meta name="keywords" content="documentation, guide, API, FAQ, platform, release notes" />
        <meta property="og:title" content="FinanceFlow - Documentation" />
        <meta property="og:description" content="Explore the documentation to get detailed information about using the platform." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://financeflow.com/documentation" />
      </Helmet>
      <Navbar />

      {/* Hero Section with Title */}
      <section className="bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white text-center py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Explore all the resources and guides you need to get started and make the most out of our platform.
          </p>
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-10 pr-4 py-2 w-full bg-white/10 border-white/20 text-white placeholder:text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-800 text-white p-4 md:p-6 md:min-h-[calc(100vh-300px)]">
          <ScrollArea className="h-[calc(100vh-350px)]">
            {loading ? (
              <>
                <Skeleton className="h-6 w-3/4 mb-6 bg-gray-700" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-5 w-full bg-gray-700" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-6">Documentation</h3>
                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm uppercase tracking-wider text-gray-400">{category}</h4>
                      <ul className="space-y-1">
                        {filteredDocs
                          .filter(doc => doc.category === category)
                          .map((doc) => (
                            <li key={doc.id}>
                              <button
                                onClick={() => setSelectedDoc(doc)}
                                className={`text-base font-medium hover:text-blue-400 transition duration-300 w-full text-left p-2 rounded-md ${
                                  selectedDoc?.id === doc.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-blue-900/30'
                                }`}
                              >
                                {doc.title}
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ScrollArea>
        </div>

        {/* Document Content Area */}
        <div className="w-full md:w-3/4 bg-white p-4 md:p-8 overflow-y-auto flex flex-col">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/3 mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : selectedDoc ? (
            <div className="prose max-w-none">
              {renderMarkdown(selectedDoc.content)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a document from the sidebar</p>
            </div>
          )}
          
          {/* Feedback section */}
          {selectedDoc && !loading && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-2">Was this helpful?</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Yes</Button>
                <Button variant="outline" size="sm">No</Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
