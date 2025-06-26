
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
import { useToast } from '@/hooks/use-toast';
import { blogService, Blog } from '@/services/blogService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import Footer from '@/components/Footer';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [blog, setBlog] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author_name: '',
    featured_image: '',
    category: '',
    tags: [],
    published: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Load blog for editing
  useEffect(() => {
    if (isEditing && id) {
      loadBlog(id);
    }
  }, [id, isEditing]);

  // Generate slug from title
  useEffect(() => {
    if (!isEditing && blog.title && !blog.slug) {
      const generatedSlug = blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setBlog(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [blog.title, isEditing]);

  const loadBlog = async (blogId: string) => {
    try {
      setIsLoading(true);
      const blogData = await blogService.getBlogBySlug(blogId);
      setBlog(blogData);
      setImagePreview(blogData.featured_image || '');
    } catch (error: any) {
      toast({
        title: 'Error loading blog',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/blogs/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const imagePath = await response.text();
      return imagePath;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !blog.tags?.includes(tagInput.trim())) {
      setBlog(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    try {
      setSaving(true);

      let featuredImageUrl = blog.featured_image || '';

      // Upload featured image if new file selected
      if (imageFile) {
        featuredImageUrl = await handleImageUpload(imageFile);
      }

      const blogData = {
        ...blog,
        featured_image: featuredImageUrl,
        published: publish,
      };

      let savedBlog: Blog;
      if (isEditing && id) {
        savedBlog = await blogService.updateBlog(id, blogData);
      } else {
        savedBlog = await blogService.createBlog(blogData as Omit<Blog, 'id' | 'created_at' | 'updated_at'>);
      }

      toast({
        title: 'Success',
        description: `Blog ${publish ? 'published' : 'saved'} successfully`,
      });

      if (!isEditing) {
        navigate(`/editor/blogs/${savedBlog.id}`);
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
        <title>{isEditing ? 'Edit Blog' : 'Create New Blog'} | FinanceFlow</title>
        <meta name="description" content="Create and edit blog posts for FinanceFlow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/blog')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Update your blog post' : 'Write and publish your new blog post'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="bg-gradient-to-r from-brand-purple to-brand-tertiary-purple"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
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
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={blog.slug}
                      onChange={(e) => setBlog(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="auto-generated-from-title"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL: financeflow.com/blog/{blog.slug || 'your-slug'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={blog.excerpt}
                      onChange={(e) => setBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description for search engines and previews..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Featured image preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          setBlog(prev => ({ ...prev, featured_image: '' }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="featured-image">Upload Image</Label>
                    <Input
                      id="featured-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image-url">Or Image URL</Label>
                    <Input
                      id="image-url"
                      value={blog.featured_image}
                      onChange={(e) => {
                        setBlog(prev => ({ ...prev, featured_image: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={blog.author_name}
                      onChange={(e) => setBlog(prev => ({ ...prev, author_name: e.target.value }))}
                      placeholder="Author name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={blog.category}
                      onChange={(e) => setBlog(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Finance, Business, Tips"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {blog.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Publication Status</span>
                    <Badge variant={blog.published ? "default" : "secondary"}>
                      {blog.published ? "Published" : "Draft"}
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
