
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrialStatus {
  status: 'not_started' | 'active' | 'expired';
  endDate: Date | null;
  isLoading: boolean;
  error: Error | null;
}

interface CheckTrialStatusResponse {
  status: 'not_started' | 'active' | 'expired';
  end_date: string | null;
}

export function useTrialStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<TrialStatus>({
    status: 'not_started',
    endDate: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setStatus(s => ({ ...s, isLoading: false }));
        return;
      }

      console.log('Checking trial status for user:', user.id);
      try {
        const { data, error } = await supabase.rpc('check_trial_status', {
          user_id: user.id
        }) as { data: CheckTrialStatusResponse, error: any };

        if (error) {
          console.error('Error checking trial status:', error);
          setStatus(s => ({ 
            ...s, 
            isLoading: false, 
            error: new Error(error.message || 'Failed to check trial status') 
          }));
          return;
        }
        
        console.log('Trial status response:', data);
        
        if (data) {
          setStatus({
            status: data.status,
            endDate: data.end_date ? new Date(data.end_date) : null,
            isLoading: false,
            error: null
          });
        } else {
          console.log('No trial status data returned');
          setStatus(s => ({ 
            ...s, 
            isLoading: false,
            error: new Error('No trial status data returned') 
          }));
        }
      } catch (error) {
        console.error('Exception checking trial status:', error);
        setStatus(s => ({ 
          ...s, 
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error checking trial status')
        }));
      }
    };

    checkStatus();
  }, [user]);

  return status;
}
