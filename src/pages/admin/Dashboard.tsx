
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase/database';
import { Card } from '@/components/ui/card';

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalDocuments: number;
  activeSubscriptions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogs: 0,
    totalDocuments: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch blogs count
        const { count: blogsCount, error: blogsError } = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true });

        // Fetch documents count
        const { count: docsCount, error: docsError } = await supabase
          .from('documentation')
          .select('*', { count: 'exact', head: true });

        // Fetch active subscriptions
        const { count: subscriptionsCount, error: subsError } = await supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch recent activities
        const { data: activities, error: activitiesError } = await supabase
          .from('subscription_logs')
          .select(`
            id,
            created_at,
            event_type,
            previous_status,
            new_status,
            user_id,
            profiles:profiles(email)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalUsers: usersCount || 0,
          totalBlogs: blogsCount || 0,
          totalDocuments: docsCount || 0,
          activeSubscriptions: subscriptionsCount || 0,
        });

        setRecentActivities(activities || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Admin Dashboard | FinanceFlow</title>
      </Helmet>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your content and monitor user activity</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          loading={loading}
        />
        <StatCard
          title="Published Blogs"
          value={stats.totalBlogs}
          loading={loading}
        />
        <StatCard
          title="Documentation Pages"
          value={stats.totalDocuments}
          loading={loading}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          loading={loading}
        />
      </div>

      {/* Recent Activities */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Recent Subscription Activities</h2>
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">Loading activities...</div>
          ) : recentActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-4 py-3 text-sm">{new Date(activity.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{activity.profiles?.email || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{formatEventType(activity.event_type)}</td>
                      <td className="px-4 py-3 text-sm">
                        {activity.previous_status && activity.new_status ? (
                          <span>
                            {formatStatus(activity.previous_status)} <span className="text-gray-400">→</span> {formatStatus(activity.new_status)}
                          </span>
                        ) : (
                          formatStatus(activity.new_status) || 'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No recent activities</div>
          )}
        </Card>
      </section>
    </div>
  );
};

// Helper component for stat cards
const StatCard = ({ title, value, loading }: { title: string; value: number; loading: boolean }) => {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {loading ? (
        <div className="h-8 mt-2 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-3xl font-bold mt-1">{value}</p>
      )}
    </Card>
  );
};

// Helper functions for formatting
const formatEventType = (eventType: string) => {
  return eventType
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatStatus = (status: string) => {
  if (!status) return '';
  
  const statusColors: Record<string, string> = {
    active: 'text-green-600',
    canceled: 'text-red-600',
    trialing: 'text-blue-600',
    past_due: 'text-yellow-600',
    incomplete: 'text-orange-600',
    incomplete_expired: 'text-gray-600',
    unpaid: 'text-red-500',
  };

  return (
    <span className={statusColors[status] || 'text-gray-600'}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
    </span>
  );
};

export default AdminDashboard;
