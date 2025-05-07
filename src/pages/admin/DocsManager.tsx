
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

interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const DocsManager = () => {
  const [docs, setDocs] = useState<DocPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<DocPage | null>(null);
  const [formData, setFormData] = useState<Partial<DocPage>>({
    title: "",
    slug: "",
    content: "",
    category: "",
    order_index: 0,
    published: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documentation")
        .select("*")
        .order("category")
        .order("order_index");

      if (error) throw error;
      setDocs(data || []);
    } catch (error: any) {
      console.error("Error fetching documentation:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documentation pages",
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0,
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
      content: "",
      category: "",
      order_index: 0,
      published: true,
    });
  };

  const handleAddDoc = async () => {
    try {
      if (!formData.title || !formData.content || !formData.category) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const newDoc = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title || ""),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("documentation")
        .insert([newDoc])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Documentation page created successfully",
      });

      setShowAddDialog(false);
      resetForm();
      fetchDocs();
    } catch (error: any) {
      console.error("Error adding documentation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create documentation page",
        variant: "destructive",
      });
    }
  };

  const handleEditDoc = async () => {
    try {
      if (!currentDoc?.id || !formData.title || !formData.content || !formData.category) {
        toast({
          title: "Error",
          description: "Invalid data or missing required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("documentation")
        .update({
          ...formData,
          slug: formData.slug || generateSlug(formData.title || ""),
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentDoc.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Documentation page updated successfully",
      });

      setShowEditDialog(false);
      resetForm();
      fetchDocs();
    } catch (error: any) {
      console.error("Error updating documentation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update documentation page",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDoc = async () => {
    try {
      if (!currentDoc?.id) return;

      const { error } = await supabase
        .from("documentation")
        .delete()
        .eq("id", currentDoc.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Documentation page deleted successfully",
      });

      setShowDeleteDialog(false);
      fetchDocs();
    } catch (error: any) {
      console.error("Error deleting documentation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete documentation page",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (doc: DocPage) => {
    setCurrentDoc(doc);
    setFormData({
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      category: doc.category,
      order_index: doc.order_index,
      published: doc.published,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (doc: DocPage) => {
    setCurrentDoc(doc);
    setShowDeleteDialog(true);
  };

  const filteredDocs = docs.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Helmet>
        <title>Documentation Manager | Admin Panel</title>
      </Helmet>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documentation Manager</h1>
          <p className="text-gray-600">Create and manage documentation pages</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="mt-4 sm:mt-0">
          <Plus size={16} className="mr-2" />
          New Page
        </Button>
      </header>

      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search documentation..."
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
              <p className="mt-2 text-gray-600">Loading documentation...</p>
            </div>
          ) : filteredDocs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{doc.order_index}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          doc.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {doc.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(doc)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(doc)}
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
              <p className="text-gray-500">No documentation pages found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Documentation Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Documentation Page</DialogTitle>
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
                  placeholder="Page title"
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
                  placeholder="page-slug"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
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
                        <SelectItem value="Getting Started">Getting Started</SelectItem>
                        <SelectItem value="Features">Features</SelectItem>
                        <SelectItem value="Integrations">Integrations</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                        <SelectItem value="FAQs">FAQs</SelectItem>
                        <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="order_index" className="block text-sm font-medium text-gray-700 mb-1">
                    Order Index
                  </label>
                  <Input
                    id="order_index"
                    name="order_index"
                    type="number"
                    min="0"
                    value={formData.order_index || 0}
                    onChange={handleNumberChange}
                  />
                </div>
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
                  placeholder="Page content in Markdown format"
                  required
                  rows={12}
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
            <Button onClick={handleAddDoc}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Documentation Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Documentation Page</DialogTitle>
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
                  placeholder="Page title"
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
                  placeholder="page-slug"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
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
                        <SelectItem value="Getting Started">Getting Started</SelectItem>
                        <SelectItem value="Features">Features</SelectItem>
                        <SelectItem value="Integrations">Integrations</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                        <SelectItem value="FAQs">FAQs</SelectItem>
                        <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="edit-order" className="block text-sm font-medium text-gray-700 mb-1">
                    Order Index
                  </label>
                  <Input
                    id="edit-order"
                    name="order_index"
                    type="number"
                    min="0"
                    value={formData.order_index || 0}
                    onChange={handleNumberChange}
                  />
                </div>
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
                  placeholder="Page content in Markdown format"
                  required
                  rows={12}
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
            <Button onClick={handleEditDoc}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the documentation page "{currentDoc?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoc} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocsManager;
