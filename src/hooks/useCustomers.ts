
import { useState, useEffect } from 'react';
import { customerService, Customer } from '@/services/customerService';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export const useCustomers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching profile for user:', user.id);
      // First get the business profile to get the business ID
      const profileData = await authService.fetchProfile(user.id);
      console.log('Profile data received:', profileData);
      
      if (profileData?.id) {
        console.log('Fetching customers for business ID:', profileData.id);
        // Then fetch customers using the business ID
        const customersData = await customerService.getCustomersByBusinessId(profileData.id);
        console.log('Customers data received:', customersData);
        setCustomers(customersData);
      } else {
        setError('Business profile not found');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user?.id]);

  return {
    customers,
    isLoading,
    error,
    refetch: fetchCustomers,
  };
};
