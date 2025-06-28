
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { blogService, Blog } from '@/services/blogService';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import Footer from '@/components/Footer';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [blog, setBlog] = useState<Partial<Blog>>({
    title: '',
    metaDescription: '',
    content: '',
    status: 'DRAFT',
    imageUrls: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isEditing && id && id !== 'add') {
      loadBlog(id);
    }
  }, [id, isEditing]);

  const loadBlog = async (blogId: string) => {
    try {
      setIsLoading(true);
      // For editing, we need to get by ID, but the API uses slug
      // We'll need to get all blogs and find by ID for now
      const allBlogs = await blogService.getAllBlogs();
      const blogData = allBlogs.find(b => b.id === blogId);
      if (blogData) {
        setBlog(blogData);
        setImageUrl(blogData.imageUrls && blogData.imageUrls.length > 0 ? blogData.imageUrls[0] : '');
      } else {
        throw new Error('Blog not found');
      }
    } catch (error: any) {
      toast({
        title: 'Error loading blog',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/blog/editor/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setBlog(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setBlog(prev => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, index) => index !== indexToRemove) || []
    }));
  };

  const handleSave = async (statusOverride?: string) => {
    if (!blog.title || !blog.metaDescription) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in the title and meta description.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const blogData = {
        title: blog.title,
        metaDescription: blog.metaDescription,
        content: blog.content || '',
        status: statusOverride || blog.status || 'DRAFT',
        imageUrls: blog.imageUrls || [],
      };

      let savedBlog: Blog;
      if (isEditing && id && id !== 'add') {
        savedBlog = await blogService.updateBlog(id, blogData);
      } else {
        savedBlog = await blogService.createBlog(blogData);
      }

      toast({
        title: 'Success',
        description: `Blog ${statusOverride === 'PUBLISHED' ? 'published' : 'saved'} successfully`,
      });

      if (!isEditing || id === 'add') {
        navigate(`/blog/editor/blog/${savedBlog.id}/edit`);
      } else {
        // Reload the blog to get updated data
        setBlog(savedBlog);
      }
    } catch (error: any) {
      toast({
        title: 'Error saving blog',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{isEditing && id !== 'add' ? 'Edit Blog' : 'Create New Blog'} | FinanceFlow</title>
        <meta name="description" content="Create and edit blog posts for FinanceFlow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/blog/editor/blog')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Management
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing && id !== 'add' ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h1>
                <p className="text-gray-600">
                  {isEditing && id !== 'add' ? 'Update your blog post' : 'Write and publish your new blog post'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('PUBLISHED')}
                disabled={isSaving}
                className="bg-gradient-to-r from-brand-purple to-brand-tertiary-purple"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details of your blog post</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={blog.title}
                      onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter blog title..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description *</Label>
                    <Textarea
                      id="metaDescription"
                      value={blog.metaDescription}
                      onChange={(e) => setBlog(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Brief description for search engines and previews..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>Write your blog post content using the rich text editor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReactQuill
                    theme="snow"
                    value={blog.content}
                    onChange={(content) => setBlog(prev => ({ ...prev, content }))}
                    modules={quillModules}
                    style={{ minHeight: '400px' }}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blog.imageUrls && blog.imageUrls.length > 0 && (
                    <div className="space-y-2">
                      {blog.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Image URL"
                    />
                    <Button type="button" onClick={handleAddImage} size="sm" disabled={!imageUrl.trim()}>
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Publication Status</Label>
                    <Select
                      value={blog.status}
                      onValueChange={(value) => setBlog(prev => ({ ...prev, status: value as Blog['status'] }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Status</span>
                    <Badge variant={blog.status === 'PUBLISHED' ? "default" : "secondary"}>
                      {blog.status || 'DRAFT'}
                    </Badge>
                  </div>
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

export default BlogEditor;
