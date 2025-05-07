
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase/database";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Edit, Plus } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  interval_count: number;
  trial_period_days: number | null;
  features: string[];
  is_active: boolean;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  profiles: {
    email: string;
    first_name: string;
    last_name: string;
  };
  plans: {
    name: string;
    interval: string;
    price: number;
    currency: string;
  };
}

interface SubscriptionLog {
  id: string;
  created_at: string;
  subscription_id: string;
  event_type: string;
  previous_status: string | null;
  new_status: string | null;
  details: any;
  profiles: {
    email: string;
  };
}

const SubscriptionManager = () => {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [logs, setLogs] = useState<SubscriptionLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [planFormData, setPlanFormData] = useState<Partial<Plan>>({
    name: "",
    description: "",
    price: 0,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    trial_period_days: null,
    features: [],
    is_active: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "plans") {
      fetchPlans();
    } else if (activeTab === "subscriptions") {
      fetchSubscriptions();
    } else if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("price");
      
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          profiles:user_id(email, first_name, last_name),
          plans:plan_id(name, interval, price, currency)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscription_logs")
        .select(`
          *,
          profiles:user_id(email)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription logs",
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
    setPlanFormData({
      ...planFormData,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split("\n").filter(f => f.trim() !== "");
    setPlanFormData({
      ...planFormData,
      features,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setPlanFormData({
      ...planFormData,
      [name]: value,
    });
  };

  const resetPlanForm = () => {
    setPlanFormData({
      name: "",
      description: "",
      price: 0,
      currency: "usd",
      interval: "month",
      interval_count: 1,
      trial_period_days: null,
      features: [],
      is_active: true,
    });
  };

  const openEditPlanDialog = (plan: Plan) => {
    setCurrentPlan(plan);
    setPlanFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      interval_count: plan.interval_count,
      trial_period_days: plan.trial_period_days,
      features: plan.features || [],
      is_active: plan.is_active,
    });
    setShowPlanDialog(true);
  };

  const handleSavePlan = async () => {
    try {
      if (!planFormData.name || !planFormData.description || planFormData.price === undefined) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (currentPlan) {
        // Update existing plan
        const { error } = await supabase
          .from("plans")
          .update({
            name: planFormData.name,
            description: planFormData.description,
            price: planFormData.price,
            currency: planFormData.currency,
            interval: planFormData.interval,
            interval_count: planFormData.interval_count,
            trial_period_days: planFormData.trial_period_days,
            features: planFormData.features,
            is_active: planFormData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentPlan.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subscription plan updated successfully",
        });
      } else {
        // Create new plan
        const { error } = await supabase
          .from("plans")
          .insert({
            name: planFormData.name,
            description: planFormData.description,
            price: planFormData.price,
            currency: planFormData.currency,
            interval: planFormData.interval,
            interval_count: planFormData.interval_count || 1,
            trial_period_days: planFormData.trial_period_days,
            features: planFormData.features,
            is_active: planFormData.is_active,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subscription plan created successfully",
        });
      }

      setShowPlanDialog(false);
      resetPlanForm();
      fetchPlans();
    } catch (error: any) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save subscription plan",
        variant: "destructive",
      });
    }
  };

  // Filter functions for search
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.profiles.first_name && sub.profiles.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.profiles.last_name && sub.profiles.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.plans.name && sub.plans.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLogs = logs.filter(log =>
    log.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.new_status && log.new_status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper formatting functions
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatInterval = (interval: string, count?: number) => {
    if (count && count > 1) {
      return `${count} ${interval}s`;
    }
    return interval;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Helmet>
        <title>Subscription Manager | Admin Panel</title>
      </Helmet>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Subscription Manager</h1>
        <p className="text-gray-600">Manage subscription plans and monitor user subscriptions</p>
      </header>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full"
              />
            </div>
            {activeTab === "plans" && (
              <Button onClick={() => {
                setCurrentPlan(null);
                resetPlanForm();
                setShowPlanDialog(true);
              }}>
                <Plus size={16} className="mr-2" />
                New Plan
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions">
          <Card>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading subscriptions...</p>
                </div>
              ) : filteredSubscriptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Auto Renew</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div className="font-medium">{subscription.profiles.first_name} {subscription.profiles.last_name}</div>
                          <div className="text-xs text-gray-500">{subscription.profiles.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{subscription.plans.name}</div>
                          <div className="text-xs text-gray-500">{subscription.plans.interval}</div>
                        </TableCell>
                        <TableCell>
                          <SubscriptionStatusBadge status={subscription.status} />
                        </TableCell>
                        <TableCell>{formatDate(subscription.current_period_start)}</TableCell>
                        <TableCell>{formatDate(subscription.current_period_end)}</TableCell>
                        <TableCell>{formatCurrency(subscription.plans.price, subscription.plans.currency)}</TableCell>
                        <TableCell>{!subscription.cancel_at_period_end ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No subscriptions found</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading plans...</p>
                </div>
              ) : filteredPlans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{plan.description}</div>
                        </TableCell>
                        <TableCell>{formatCurrency(plan.price, plan.currency)}</TableCell>
                        <TableCell>{formatInterval(plan.interval, plan.interval_count)}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <ul className="text-sm list-disc list-inside">
                              {plan.features && plan.features.length > 0 ? (
                                plan.features.slice(0, 2).map((feature, i) => (
                                  <li key={i} className="truncate">{feature}</li>
                                ))
                              ) : (
                                <span className="text-gray-400">No features listed</span>
                              )}
                              {plan.features && plan.features.length > 2 && (
                                <li className="text-gray-500">+{plan.features.length - 2} more</li>
                              )}
                            </ul>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            plan.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {plan.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditPlanDialog(plan)}
                          >
                            <Edit size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No plans found</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading activity logs...</p>
                </div>
              ) : filteredLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Status Change</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDate(log.created_at)}</TableCell>
                        <TableCell>{log.profiles?.email || "Unknown"}</TableCell>
                        <TableCell>{formatEventType(log.event_type)}</TableCell>
                        <TableCell>
                          {log.previous_status && log.new_status ? (
                            <span>
                              <SubscriptionStatusBadge status={log.previous_status} size="xs" />
                              <span className="mx-1">→</span>
                              <SubscriptionStatusBadge status={log.new_status} size="xs" />
                            </span>
                          ) : log.new_status ? (
                            <SubscriptionStatusBadge status={log.new_status} size="xs" />
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.details ? (
                            <div className="text-xs max-w-xs truncate">
                              {JSON.stringify(log.details)}
                            </div>
                          ) : (
                            <span className="text-gray-500">No details</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No activity logs found</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={planFormData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Basic Plan"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <Input
                  id="description"
                  name="description"
                  value={planFormData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Perfect for small businesses"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={planFormData.price || 0}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <Select
                    value={planFormData.currency || "usd"}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Interval
                  </label>
                  <Select
                    value={planFormData.interval || "month"}
                    onValueChange={(value) => handleSelectChange("interval", value)}
                  >
                    <SelectTrigger id="interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="interval_count" className="block text-sm font-medium text-gray-700 mb-1">
                    Interval Count
                  </label>
                  <Input
                    id="interval_count"
                    name="interval_count"
                    type="number"
                    min="1"
                    value={planFormData.interval_count || 1}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of intervals between billings (e.g., 1 for monthly, 3 for quarterly)
                  </p>
                </div>

                <div>
                  <label htmlFor="trial_period_days" className="block text-sm font-medium text-gray-700 mb-1">
                    Trial Period (days)
                  </label>
                  <Input
                    id="trial_period_days"
                    name="trial_period_days"
                    type="number"
                    min="0"
                    value={planFormData.trial_period_days || 0}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  id="features"
                  name="features"
                  className="w-full min-h-[120px] p-2 rounded-md border border-gray-300 focus:ring-brand-purple focus:border-brand-purple"
                  value={planFormData.features?.join("\n") || ""}
                  onChange={handleFeaturesChange}
                  placeholder="Up to 20 invoices per month&#10;Basic expense tracking&#10;Email support"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={planFormData.is_active}
                  onChange={(e) => setPlanFormData({...planFormData, is_active: e.target.checked})}
                  className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active Plan
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>{currentPlan ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper components
const SubscriptionStatusBadge = ({ status, size = "default" }: { status: string, size?: "default" | "xs" }) => {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    canceled: "bg-gray-100 text-gray-800",
    incomplete: "bg-yellow-100 text-yellow-800",
    incomplete_expired: "bg-red-100 text-red-800",
    past_due: "bg-orange-100 text-orange-800",
    trialing: "bg-blue-100 text-blue-800",
    unpaid: "bg-red-100 text-red-800",
  };

  const sizeClasses = size === "xs" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs";
  
  return (
    <span className={`${sizeClasses} rounded-full ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
      {formatStatusText(status)}
    </span>
  );
};

const formatStatusText = (status: string) => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatEventType = (eventType: string) => {
  return eventType
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default SubscriptionManager;
