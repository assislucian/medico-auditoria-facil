
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrialStatus {
  status: 'not_started' | 'active' | 'expired';
  endDate: Date | null;
  isLoading: boolean;
}

// Define the expected return type from the RPC function
interface CheckTrialStatusResponse {
  status: 'not_started' | 'active' | 'expired';
  end_date: string | null;
}

export function useTrialStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<TrialStatus>({
    status: 'not_started',
    endDate: null,
    isLoading: true
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setStatus(s => ({ ...s, isLoading: false }));
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc<CheckTrialStatusResponse>('check_trial_status', {
            user_id: user.id
          });

        if (error) throw error;

        if (data) {
          setStatus({
            status: data.status,
            endDate: data.end_date ? new Date(data.end_date) : null,
            isLoading: false
          });
        } else {
          setStatus(s => ({ ...s, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        setStatus(s => ({ ...s, isLoading: false }));
      }
    };

    checkStatus();
  }, [user]);

  return status;
}
