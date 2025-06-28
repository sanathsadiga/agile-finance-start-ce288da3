
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogService, Blog } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
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
      
      // Load related blogs
      const allBlogs = await blogService.getPublishedBlogs();
      const related = allBlogs
        .filter(b => b.id !== blogData.id)
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
        text: blog?.metaDescription,
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

  const publishedDate = new Date(blog.createdAt);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{blog.title} | FinanceFlow Blog</title>
        <meta name="description" content={blog.metaDescription} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.metaDescription} />
        {blog.imageUrls && blog.imageUrls.length > 0 && (
          <meta property="og:image" content={blog.imageUrls[0]} />
        )}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.metaDescription} />
        {blog.imageUrls && blog.imageUrls.length > 0 && (
          <meta name="twitter:image" content={blog.imageUrls[0]} />
        )}
        
        {/* Article metadata */}
        <meta property="article:published_time" content={blog.createdAt} />

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.metaDescription,
            "image": blog.imageUrls && blog.imageUrls.length > 0 ? blog.imageUrls[0] : undefined,
            "publisher": {
              "@type": "Organization",
              "name": "FinanceFlow",
            },
            "datePublished": blog.createdAt,
            "dateModified": blog.updatedAt,
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
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Blog Header */}
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                {blog.status}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.metaDescription}
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
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
            {blog.imageUrls && blog.imageUrls.length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
                <img
                  src={blog.imageUrls[0]}
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
                            {relatedBlog.imageUrls && relatedBlog.imageUrls.length > 0 && (
                              <img
                                src={relatedBlog.imageUrls[0]}
                                alt={relatedBlog.title}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            )}
                            <h4 className="text-sm font-medium group-hover:text-brand-purple transition-colors line-clamp-2">
                              {relatedBlog.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(relatedBlog.createdAt).toLocaleDateString()}
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
