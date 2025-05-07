
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isSupport, setIsSupport] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return;
      
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();
        
      if (userError) return;
      
      setCurrentUser(userData);
      setCurrentEmail(userData.email);
      setIsSupport(userData.email === "support@econatuarls.site");
    };
    
    fetchCurrentUser();
  }, []);

  const handleRunDatabaseMigration = async () => {
    if (!isSupport) {
      toast({
        title: "Permission Denied",
        description: "Only the support account can run database migrations",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // This would typically call a secure edge function to run migrations
      // For demo purposes, we'll just show a success message
      toast({
        title: "Migration Started",
        description: "Database migration has been initiated",
      });
    } catch (error: any) {
      console.error("Error running migration:", error);
      toast({
        title: "Migration Failed",
        description: error.message || "Failed to run database migration",
        variant: "destructive",
      });
    }
  };

  const handleResetDatabase = async () => {
    if (!isSupport) {
      toast({
        title: "Permission Denied",
        description: "Only the support account can reset the database",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // This would typically call a secure edge function to reset the database
      // For demo purposes, we'll just show a success message
      toast({
        title: "Reset Initiated",
        description: "Database reset process has been started",
      });
    } catch (error: any) {
      console.error("Error resetting database:", error);
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset database",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Admin Settings | Admin Panel</title>
      </Helmet>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-gray-600">System configuration and maintenance</p>
      </header>

      <div className="grid gap-6">
        {/* Current User Info */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Current User</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Loading..."}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {currentEmail || "Loading..."}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              {currentUser?.is_admin ? "Admin" : "User"}
              {isSupport ? " (Support Account)" : ""}
            </p>
          </div>
        </Card>

        {/* Database Management */}
        {isSupport && (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Database Management</h2>
            <p className="text-gray-600 mb-4">
              These actions affect the database structure and data. Use with caution.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={handleRunDatabaseMigration}>
                Run Database Migration
              </Button>
              <Button variant="outline" className="text-red-500" onClick={handleResetDatabase}>
                Reset Database
              </Button>
            </div>
          </Card>
        )}

        {/* Documentation */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">System Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Admin Panel Access</h3>
              <p className="text-gray-600">
                Access to the admin panel is restricted to users with admin privileges. The support account 
                (support@econatuarls.site) has full administrative rights, including the ability to grant 
                or revoke admin access for other users.
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Subscription System</h3>
              <p className="text-gray-600">
                The subscription system includes plans, subscriptions, and activity logs. 
                Plans define the pricing and features, while subscriptions link users to specific plans
                with start and end dates. Activity logs track subscription lifecycle events.
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Content Management</h3>
              <p className="text-gray-600">
                Blog posts and documentation can be managed through the admin panel.
                All content is stored in the database and displayed on the respective public pages.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
