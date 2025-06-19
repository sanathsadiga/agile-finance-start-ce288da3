
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export const useBusinessProfile = () => {
  const { user } = useAuth();
  const [profileId, setProfileId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileId = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching business profile for user:', user.id);
      const profileData = await authService.fetchProfile(user.id);
      console.log('Business profile data received:', profileData);
      
      if (profileData?.id) {
        setProfileId(profileData.id);
      } else {
        setError('Business profile not found');
      }
    } catch (err) {
      console.error('Error fetching business profile:', err);
      setError('Failed to fetch business profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileId();
  }, [user?.id]);

  return {
    profileId,
    isLoading,
    error,
    refetch: fetchProfileId,
  };
};
