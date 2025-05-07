
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase/database";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Plus, Search } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  featured_image: string;
  published_at: string;
  category: string;
  tags: string[];
  published: boolean;
}

const BlogManager = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author_name: "",
    featured_image: "",
    category: "",
    tags: [],
    published: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData({
      ...formData,
      tags,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author_name: "",
      featured_image: "",
      category: "",
      tags: [],
      published: true,
    });
  };

  const handleAddBlog = async () => {
    try {
      if (!formData.title || !formData.excerpt || !formData.content) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const newBlog = {
        ...formData,
        published_at: new Date().toISOString(),
        slug: formData.slug || generateSlug(formData.title || ""),
      };

      const { data, error } = await supabase
        .from("blogs")
        .insert([newBlog])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      setShowAddDialog(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      console.error("Error adding blog:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    }
  };

  const handleEditBlog = async () => {
    try {
      if (!currentBlog?.id || !formData.title || !formData.excerpt || !formData.content) {
        toast({
          title: "Error",
          description: "Invalid data or missing required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("blogs")
        .update({
          ...formData,
          slug: formData.slug || generateSlug(formData.title || ""),
        })
        .eq("id", currentBlog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });

      setShowEditDialog(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlog = async () => {
    try {
      if (!currentBlog?.id) return;

      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", currentBlog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      setShowDeleteDialog(false);
      fetchBlogs();
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author_name: blog.author_name,
      featured_image: blog.featured_image,
      category: blog.category,
      tags: blog.tags || [],
      published: blog.published,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setShowDeleteDialog(true);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Helmet>
        <title>Blog Manager | Admin Panel</title>
      </Helmet>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-gray-600">Create, edit, and manage blog posts</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="mt-4 sm:mt-0">
          <Plus size={16} className="mr-2" />
          New Blog Post
        </Button>
      </header>

      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading blogs...</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          blog.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(blog.published_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(blog)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(blog)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No blog posts found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Blog Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Blog title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  placeholder="blog-post-slug"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt || ""}
                  onChange={handleInputChange}
                  placeholder="Brief description of the blog post"
                  required
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleInputChange}
                  placeholder="Full blog post content"
                  required
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <Input
                    id="author_name"
                    name="author_name"
                    value={formData.author_name || ""}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Accounting">Accounting</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Tips">Tips</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
                <Input
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags?.join(", ") || ""}
                  onChange={handleTagsChange}
                  placeholder="finance, accounting, business"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBlog}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Blog title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <Input
                  id="edit-slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  placeholder="blog-post-slug"
                />
              </div>

              <div>
                <label htmlFor="edit-excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <Textarea
                  id="edit-excerpt"
                  name="excerpt"
                  value={formData.excerpt || ""}
                  onChange={handleInputChange}
                  placeholder="Brief description of the blog post"
                  required
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <Textarea
                  id="edit-content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleInputChange}
                  placeholder="Full blog post content"
                  required
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <Input
                    id="edit-author"
                    name="author_name"
                    value={formData.author_name || ""}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Accounting">Accounting</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Tips">Tips</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
                <Input
                  id="edit-image"
                  name="featured_image"
                  value={formData.featured_image || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <Input
                  id="edit-tags"
                  name="tags"
                  value={formData.tags?.join(", ") || ""}
                  onChange={handleTagsChange}
                  placeholder="finance, accounting, business"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                />
                <label htmlFor="edit-published" className="text-sm font-medium text-gray-700">
                  Published
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBlog}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post "{currentBlog?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBlog} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManager;
