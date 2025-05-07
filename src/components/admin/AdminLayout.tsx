
import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/database";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Book,
  Users,
  Settings,
  LogOut,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        navigate("/admin/login");
        return;
      }
      
      // Check if user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, first_name, last_name")
        .eq("id", data.session.user.id)
        .single();

      if (profileError || !profileData?.is_admin) {
        // Not an admin, sign out and redirect
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      
      setUser({
        ...data.session.user,
        firstName: profileData.first_name,
        lastName: profileData.last_name
      });
      setLoading(false);
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-brand-purple">Admin Panel</h1>
        </div>
        
        <div className="py-4">
          <nav className="space-y-1 px-2">
            <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavLink to="/admin/blogs" icon={<FileText size={18} />} label="Blogs" />
            <NavLink to="/admin/documentation" icon={<Book size={18} />} label="Documentation" />
            <NavLink to="/admin/users" icon={<Users size={18} />} label="Users" />
            <NavLink to="/admin/subscriptions" icon={<CreditCard size={18} />} label="Subscriptions" />
            <NavLink to="/admin/settings" icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center text-gray-700" 
            onClick={handleSignOut}
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

// Helper component for navigation links
const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-brand-purple hover:bg-brand-purple/5"
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {label}
    </Link>
  );
};

export default AdminLayout;
