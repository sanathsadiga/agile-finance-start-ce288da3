
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/database';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author_name: string;
  featured_image: string;
  published_at: string;
  category: string;
  tags: string[];
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

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
          // Set the first post as featured if viewing blog list
          if (!slug) {
            setFeaturedPost(data[0] as BlogPost);
            // Set the rest as regular posts
            setBlogPosts(data.slice(1) as BlogPost[]);
          } else {
            // If viewing a specific post by slug
            const post = data.find(p => p.slug === slug);
            if (post) {
              setCurrentPost(post as BlogPost);
              // Remove the current post from the list to avoid duplication
              setBlogPosts(data.filter(p => p.slug !== slug) as BlogPost[]);
            } else {
              // If slug not found, show all posts with first as featured
              setFeaturedPost(data[0] as BlogPost);
              setBlogPosts(data.slice(1) as BlogPost[]);
              // Redirect to main blog page if slug doesn't exist
              navigate('/blog', { replace: true });
            }
          }
        } else {
          // Fallback to sample data if no posts in database
          useFallbackData();
        }
        
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    };
    
    const useFallbackData = () => {
      const fallbackPosts = [
        {
          id: '1',
          title: 'How to Manage Business Finances Effectively',
          slug: 'how-to-manage-business-finances',
          excerpt: 'In this blog, we share practical tips on how small business owners can manage their finances and stay organized.',
          content: 'In today\'s competitive business landscape, effective financial management is crucial for small business success. This blog post explores practical strategies for managing finances, from setting up proper accounting systems to planning for taxes and unexpected expenses. We\'ll cover best practices, common pitfalls to avoid, and tools that can help streamline your financial processes.',
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
          content: 'Proper accounting is the backbone of financial health for any business. However, many entrepreneurs make critical mistakes that can lead to cash flow problems, tax issues, or even legal troubles. This article highlights the five most common accounting errors and provides actionable advice on how to avoid them, ensuring your business maintains accurate financial records.',
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
          content: 'Manual invoicing is time-consuming and prone to errors. By implementing automated invoicing systems, businesses can save countless hours, reduce mistakes, and get paid faster. This comprehensive guide explores the key benefits of invoice automation, from improved accuracy to better client relationships, and provides practical steps for transitioning from manual to automated processes.',
          author_name: 'Tech Specialist',
          featured_image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3',
          published_at: '2023-02-10',
          category: 'Technology',
          tags: ['automation', 'invoicing', 'tech']
        }
      ];
      
      if (!slug) {
        // Set the first post as featured
        setFeaturedPost(fallbackPosts[0]);
        // Set the rest as regular posts
        setBlogPosts(fallbackPosts.slice(1));
      } else {
        // If viewing a specific post by slug
        const post = fallbackPosts.find(p => p.slug === slug);
        if (post) {
          setCurrentPost(post);
          // Filter out the current post from list
          setBlogPosts(fallbackPosts.filter(p => p.slug !== slug));
        } else {
          // If slug not found, show all posts
          setFeaturedPost(fallbackPosts[0]);
          setBlogPosts(fallbackPosts.slice(1));
          // Redirect to main blog page if slug doesn't exist
          navigate('/blog', { replace: true });
        }
      }
    };
    
    fetchBlogPosts();
  }, [navigate, slug]);

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
      
      // Also check featured post if it exists and we're not on a single post view
      if (featuredPost && !slug && !filtered.some(p => p.id === featuredPost.id)) {
        if (
          featuredPost.title.toLowerCase().includes(lowercaseQuery) ||
          featuredPost.excerpt.toLowerCase().includes(lowercaseQuery) ||
          featuredPost.category.toLowerCase().includes(lowercaseQuery) ||
          featuredPost.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        ) {
          setFilteredPosts([featuredPost, ...filtered]);
        }
      }
    } else {
      setFilteredPosts(blogPosts);
    }
  }, [searchQuery, blogPosts, featuredPost, slug]);

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

      {/* Single Post View */}
      {slug && currentPost ? (
        <div className="py-16 container mx-auto px-4 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-brand-purple hover:underline mb-8"
          >
            ← Back to all articles
          </Link>

          <article>
            <div className="mb-8">
              <span className="text-sm font-medium px-3 py-1 bg-purple-100 text-brand-purple rounded-full">
                {currentPost.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                {currentPost.title}
              </h1>
              <div className="flex items-center text-gray-600 text-sm">
                <span>{formatDate(currentPost.published_at)}</span>
                <span className="mx-2">•</span>
                <span>{currentPost.author_name}</span>
                <span className="mx-2">•</span>
                <span>{currentPost.tags.join(', ')}</span>
              </div>
            </div>

            <img 
              src={currentPost.featured_image} 
              alt={currentPost.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />

            <div className="prose prose-lg max-w-none">
              {currentPost.content ? (
                <p>{currentPost.content}</p>
              ) : (
                <p>{currentPost.excerpt}</p>
              )}
              
              {/* If there's no content, we'll add some placeholder paragraphs */}
              {!currentPost.content && (
                <>
                  <h2>Why This Matters</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at purus libero. 
                    Sed nec consectetur lectus. Nullam non dolor eu justo tincidunt scelerisque. 
                    Aenean vestibulum, mi vel lacinia lobortis, nisl tellus tempus magna, a 
                    pellentesque tortor justo a dui.
                  </p>
                  <p>
                    Maecenas fringilla dolor vitae ex gravida, in efficitur ligula convallis. 
                    Vivamus finibus felis vel nunc fringilla, ac congue mauris ornare. Ut 
                    consectetur pellentesque semper. Donec non tortor nec felis ullamcorper 
                    ullamcorper in quis eros.
                  </p>
                  <h2>Key Takeaways</h2>
                  <ul>
                    <li>Feature one detail and why it's important</li>
                    <li>Address critical aspects of the topic</li>
                    <li>Provide actionable advice for readers</li>
                    <li>Include relevant statistics or examples</li>
                  </ul>
                </>
              )}
            </div>
          </article>

          {/* Related Posts */}
          {filteredPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(0, 3).map((post, idx) => (
                  <Card 
                    key={post.id}
                    onClick={() => handlePostClick(post.slug)}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
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
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Blog Listing View
        <>
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
          ) : featuredPost && !searchQuery ? (
            <section className="py-10 container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg scroll-animate opacity-0 cursor-pointer"
                onClick={() => handlePostClick(featuredPost.slug)}>
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
                      <span className="text-brand-purple font-medium text-sm hover:text-brand-tertiary-purple transition">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {/* Blog Posts Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 scroll-animate opacity-0">
                {searchQuery ? 'Search Results' : 'Latest Articles'}
              </h2>
              
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
              ) : filteredPosts.length > 0 || (searchQuery && featuredPost) ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchQuery && featuredPost && filteredPosts.some(post => post.id === featuredPost.id) ? (
                    // If featured post matches search, show it first
                    <Card 
                      key={featuredPost.id}
                      onClick={() => handlePostClick(featuredPost.slug)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer scroll-animate opacity-0"
                    >
                      <img 
                        src={featuredPost.featured_image} 
                        alt={featuredPost.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-xs px-2 py-1 bg-purple-100 text-brand-purple rounded-full">{featuredPost.category}</span>
                          <span className="text-xs text-gray-500">{formatDate(featuredPost.published_at)}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{featuredPost.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{featuredPost.author_name}</span>
                          <span className="text-brand-purple font-medium text-sm">Read more →</span>
                        </div>
                      </div>
                    </Card>
                  ) : null}

                  {filteredPosts.filter(post => !featuredPost || post.id !== featuredPost.id).map((post, idx) => (
                    <Card 
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
                    </Card>
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
        </>
      )}

      <Footer />
    </main>
  );
};
