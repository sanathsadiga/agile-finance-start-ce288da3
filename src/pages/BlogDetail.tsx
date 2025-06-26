
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogService, Blog } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Tag, Share2, Edit } from 'lucide-react';
import Footer from '@/components/Footer';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug) {
      loadBlog(slug);
    }
  }, [slug]);

  const loadBlog = async (blogSlug: string) => {
    try {
      setIsLoading(true);
      const blogData = await blogService.getBlogBySlug(blogSlug);
      setBlog(blogData);
      
      // Load related blogs (same category or similar tags)
      const allBlogs = await blogService.getBlogs();
      const related = allBlogs
        .filter(b => b.id !== blogData.id && (
          b.category === blogData.category ||
          b.tags.some(tag => blogData.tags.includes(tag))
        ))
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (error: any) {
      toast({
        title: 'Blog not found',
        description: 'The requested blog post could not be found.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Blog link has been copied to clipboard',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(blog.published_at);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{blog.title} | FinanceFlow Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={blog.tags.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featured_image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.featured_image} />
        
        {/* Article metadata */}
        <meta property="article:published_time" content={blog.published_at} />
        <meta property="article:author" content={blog.author_name} />
        <meta property="article:section" content={blog.category} />
        {blog.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "image": blog.featured_image,
            "author": {
              "@type": "Person",
              "name": blog.author_name
            },
            "publisher": {
              "@type": "Organization",
              "name": "FinanceFlow",
              "logo": {
                "@type": "ImageObject",
                "url": "https://financeflow.com/images/logo.png"
              }
            },
            "datePublished": blog.published_at,
            "dateModified": blog.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link to="/blog">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link to={`/editor/blogs/${blog.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Header */}
            <div className="text-center mb-8">
              {blog.category && (
                <Badge variant="secondary" className="mb-4">
                  {blog.category}
                </Badge>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                {blog.author_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {blog.author_name}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {publishedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featured_image && (
              <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none prose-purple prose-headings:text-gray-900 prose-a:text-brand-purple"
                    dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Posts */}
              {relatedBlogs.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((relatedBlog) => (
                        <Link
                          key={relatedBlog.id}
                          to={`/blog/${relatedBlog.slug}`}
                          className="block group"
                        >
                          <div className="space-y-2">
                            {relatedBlog.featured_image && (
                              <img
                                src={relatedBlog.featured_image}
                                alt={relatedBlog.title}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            )}
                            <h4 className="text-sm font-medium group-hover:text-brand-purple transition-colors line-clamp-2">
                              {relatedBlog.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(relatedBlog.published_at).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-brand-purple/5 to-brand-tertiary-purple/5">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest financial insights delivered to your inbox.
                  </p>
                  <Link to="/contactus">
                    <Button className="w-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple">
                      Subscribe
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
