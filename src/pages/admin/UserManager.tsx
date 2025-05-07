
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase/database";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { Edit, Trash2, Search, UserPlus, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string;
  email_confirmed: boolean;
  is_admin: boolean;
}

const UserManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    first_name: "",
    last_name: "",
    company_name: "",
    is_admin: false,
  });
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [currentUserIsSupport, setCurrentUserIsSupport] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    checkCurrentUser();
    fetchUsers();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return;
      
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", data.session.user.id)
        .single();
        
      if (userProfile?.email === "support@econatuarls.site") {
        setCurrentUserIsSupport(true);
      }
    } catch (error) {
      console.error("Error checking current user:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      company_name: "",
      is_admin: false,
    });
    setNewAdminEmail("");
  };

  const handleEditUser = async () => {
    try {
      if (!currentUser?.id) return;

      // Determine if we're changing admin status
      const isChangingAdminStatus = 
        formData.is_admin !== undefined && 
        currentUser.is_admin !== formData.is_admin;

      // Only support@econatuarls.site can set/remove admin privileges
      if (isChangingAdminStatus && !currentUserIsSupport) {
        toast({
          title: "Permission Denied",
          description: "Only the support account can modify admin privileges",
          variant: "destructive",
        });
        return;
      }

      // If removing admin status from support@econatuarls.site, don't allow
      if (currentUser.email === "support@econatuarls.site" && 
          formData.is_admin === false) {
        toast({
          title: "Permission Denied",
          description: "Admin privileges cannot be removed from the support account",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          is_admin: formData.is_admin,
        })
        .eq("id", currentUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User profile updated successfully",
      });

      setShowEditDialog(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  const handleAddAdmin = async () => {
    try {
      if (!newAdminEmail) {
        toast({
          title: "Missing Information",
          description: "Please enter an email address",
          variant: "destructive",
        });
        return;
      }
      
      if (!currentUserIsSupport) {
        toast({
          title: "Permission Denied",
          description: "Only the support account can add new admin users",
          variant: "destructive",
        });
        return;
      }

      // Check if user exists
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newAdminEmail)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "User with this email does not exist",
          variant: "destructive",
        });
        return;
      }

      // Update user to admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", data.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "User has been granted admin privileges",
      });

      setShowAddAdminDialog(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add admin user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!currentUser?.id) return;

      // Don't allow deleting the support account
      if (currentUser.email === "support@econatuarls.site") {
        toast({
          title: "Permission Denied",
          description: "The support account cannot be deleted",
          variant: "destructive",
        });
        return;
      }

      // Only support@econatuarls.site can delete users
      if (!currentUserIsSupport) {
        toast({
          title: "Permission Denied",
          description: "Only the support account can delete users",
          variant: "destructive",
        });
        return;
      }
      
      // First delete auth user (this will cascade delete the profile due to references)
      // This requires using Supabase Functions or backend API as the client doesn't have permission
      // For now, we'll just delete the profile entry
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", currentUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been deleted",
      });

      setShowDeleteDialog(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setCurrentUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      company_name: user.company_name,
      is_admin: user.is_admin,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (user: UserProfile) => {
    setCurrentUser(user);
    setShowDeleteDialog(true);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company_name && user.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <Helmet>
        <title>User Manager | Admin Panel</title>
      </Helmet>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Manager</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {currentUserIsSupport && (
            <Button onClick={() => setShowAddAdminDialog(true)}>
              <UserPlus size={16} className="mr-2" />
              Add Admin
            </Button>
          )}
        </div>
      </header>

      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search users..."
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
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company_name || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.email_confirmed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.email_confirmed ? "Verified" : "Unverified"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <div className="flex items-center">
                          <Shield size={16} className="text-brand-purple mr-1" />
                          <span>Admin</span>
                        </div>
                      ) : "User"}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      {currentUserIsSupport && user.email !== "support@econatuarls.site" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <Input
                id="adminEmail"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="user@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                User must already have an account in the system.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAdminDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAdmin}>Add Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleInputChange}
              />
            </div>
            {currentUserIsSupport && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin || false}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                  disabled={currentUser?.email === "support@econatuarls.site"}
                />
                <label htmlFor="is_admin" className="text-sm font-medium text-gray-700">
                  Admin User
                </label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for "{currentUser?.email}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManager;
