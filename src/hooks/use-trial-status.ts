
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

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

// Define the RPC parameters type
interface CheckTrialStatusParams {
  user_id: string;
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
        // Using any to bypass TypeScript's type checking for the RPC function name
        const { data, error } = await supabase.rpc(
          'check_trial_status' as any, 
          { user_id: user.id } as CheckTrialStatusParams
        );

        if (error) throw error;
        
        if (data) {
          // Since we know the shape of the data, we can safely cast it
          const typedData = data as unknown as CheckTrialStatusResponse;
          setStatus({
            status: typedData.status,
            endDate: typedData.end_date ? new Date(typedData.end_date) : null,
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
