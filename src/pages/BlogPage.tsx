
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/database';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  featured_image: string;
  published_at: string;
  category: string;
  tags: string[];
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  // Fetch blog posts from database
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Fetch published blog posts ordered by publish date
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Set the first post as featured
          setFeaturedPost(data[0] as BlogPost);
          // Set the rest as regular posts
          setBlogPosts(data.slice(1) as BlogPost[]);
        }
        
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Fallback to sample data if database fetch fails
        const fallbackPosts = [
          {
            id: '1',
            title: 'How to Manage Business Finances Effectively',
            slug: 'how-to-manage-business-finances',
            excerpt: 'In this blog, we share practical tips on how small business owners can manage their finances and stay organized.',
            author_name: 'Finance Expert',
            featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3',
            published_at: '2023-04-15',
            category: 'Finance',
            tags: ['finance', 'business', 'accounting']
          },
          {
            id: '2',
            title: 'Top 5 Accounting Mistakes to Avoid',
            slug: 'top-5-accounting-mistakes',
            excerpt: 'Avoid common accounting mistakes with these tips that can save you time and money while keeping your business finances in check.',
            author_name: 'Accounting Professional',
            featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
            published_at: '2023-03-22',
            category: 'Accounting',
            tags: ['accounting', 'mistakes', 'best practices']
          },
          {
            id: '3',
            title: 'The Benefits of Automating Your Invoicing',
            slug: 'benefits-of-automating-invoicing',
            excerpt: 'Automation is the future! Learn how automating your invoicing process can streamline your workflow and improve cash flow.',
            author_name: 'Tech Specialist',
            featured_image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3',
            published_at: '2023-02-10',
            category: 'Technology',
            tags: ['automation', 'invoicing', 'tech']
          }
        ];
        
        // Set the first post as featured
        setFeaturedPost(fallbackPosts[0]);
        // Set the rest as regular posts
        setBlogPosts(fallbackPosts.slice(1));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = blogPosts.filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.category.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(blogPosts);
    }
  }, [searchQuery, blogPosts]);

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50/30">
      <Helmet>
        <title>FinanceFlow - Blog</title>
        <meta name="description" content="Stay updated with the latest tips, trends, and news in accounting and finance management." />
        <meta name="keywords" content="blog, accounting, finance, business, invoicing, automation" />
        <meta property="og:title" content="FinanceFlow - Blog" />
        <meta property="og:description" content="Stay updated with the latest tips, trends, and news in accounting and finance management." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://financeflow.com/blog" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 scroll-animate opacity-0">
            FinanceFlow Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto scroll-animate opacity-0">
            Explore our latest articles, tips, and insights on managing your business finances efficiently.
          </p>
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {loading ? (
        <section className="py-10 container mx-auto px-4">
          <Skeleton className="h-64 w-full rounded-xl mb-4" />
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </section>
      ) : featuredPost ? (
        <section className="py-10 container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg scroll-animate opacity-0">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.featured_image} 
                  alt={featuredPost.title}
                  className="h-64 md:h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="font-medium text-sm text-brand-purple mb-2">{featuredPost.category}</div>
                  <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span>{formatDate(featuredPost.published_at)}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.author_name}</span>
                  </div>
                  <button 
                    onClick={() => handlePostClick(featuredPost.slug)}
                    className="text-brand-purple font-medium text-sm hover:text-brand-tertiary-purple transition"
                  >
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 scroll-animate opacity-0">Latest Articles</h2>
          
          {loading ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <div 
                  key={post.id}
                  onClick={() => handlePostClick(post.slug)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer scroll-animate opacity-0"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs px-2 py-1 bg-purple-100 text-brand-purple rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-500">{formatDate(post.published_at)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{post.author_name}</span>
                      <span className="text-brand-purple font-medium text-sm">Read more →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles found matching your search.</p>
            </div>
          )}
          
          {/* Show more button */}
          {!searchQuery && filteredPosts.length > 0 && (
            <div className="mt-12 text-center">
              <Button 
                onClick={() => navigate('/blog')} 
                className="bg-brand-purple hover:bg-brand-tertiary-purple text-white"
              >
                View all articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 scroll-animate opacity-0">Stay Updated</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto scroll-animate opacity-0">
            Get the latest financial insights, tips, and news delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto scroll-animate opacity-0">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
            <Button className="bg-white text-brand-purple hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
};
