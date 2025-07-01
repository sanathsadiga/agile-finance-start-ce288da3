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
import { ArrowLeft, Save, Eye, X, FileText, LogOut } from 'lucide-react';

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
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    if (isEditing && id && id !== 'add') {
      loadBlog(id);
    }
  }, [id, isEditing, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: 'Logged out',
      description: 'You have been logged out from admin panel',
    });
    navigate('/admin/login');
  };

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
        status: (statusOverride || blog.status || 'DRAFT') as Blog['status'],
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
        navigate(`/admin/blog/${savedBlog.id}/edit`);
      } else {
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>{isEditing && id !== 'add' ? 'Edit Blog' : 'Create New Blog'} | Admin Panel</title>
        <meta name="description" content="Create and edit blog posts for FinanceFlow" />
      </Helmet>

      {/* Admin Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/blog')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Management
              </Button>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {isEditing && id !== 'add' ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {isEditing && id !== 'add' ? 'Update your blog post' : 'Write and publish your new blog post'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('PUBLISHED')}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                  <CardDescription className="text-gray-400">Enter the basic details of your blog post</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title *</Label>
                    <Input
                      id="title"
                      value={blog.title}
                      onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter blog title..."
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription" className="text-white">Meta Description *</Label>
                    <Textarea
                      id="metaDescription"
                      value={blog.metaDescription}
                      onChange={(e) => setBlog(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Brief description for search engines and previews..."
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Content</CardTitle>
                  <CardDescription className="text-gray-400">Write your blog post content using the rich text editor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg">
                    <ReactQuill
                      theme="snow"
                      value={blog.content}
                      onChange={(content) => setBlog(prev => ({ ...prev, content }))}
                      modules={quillModules}
                      style={{ minHeight: '400px' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Images</CardTitle>
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
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
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
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddImage} 
                      size="sm" 
                      disabled={!imageUrl.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status" className="text-white">Publication Status</Label>
                    <Select
                      value={blog.status}
                      onValueChange={(value) => setBlog(prev => ({ ...prev, status: value as Blog['status'] }))}
                    >
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="DRAFT" className="text-white hover:bg-gray-600">Draft</SelectItem>
                        <SelectItem value="PUBLISHED" className="text-white hover:bg-gray-600">Published</SelectItem>
                        <SelectItem value="ARCHIVED" className="text-white hover:bg-gray-600">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Current Status</span>
                    <Badge variant={blog.status === 'PUBLISHED' ? "default" : "secondary"} className="border-0">
                      {blog.status || 'DRAFT'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
