
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getProfileData } from './authUtils';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setLoading(true);
      try {
        console.log('Loading initial session...');
        const { data: { session } } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(session);
          setUser(session?.user || null);
        }

        if (session?.user && isMounted) {
          console.log('Initial session found, loading profile data...');
          try {
            // Set a timeout to prevent getting stuck
            const profilePromise = getProfileData(session.user.id);
            const timeoutPromise = new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
            );
            
            const profileData = await Promise.race([profilePromise, timeoutPromise]);
            
            if (profileData && isMounted) {
              console.log('Profile data loaded successfully');
              setProfile(profileData);
            }
          } catch (profileError) {
            console.error("Error loading profile data:", profileError);
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        if (isMounted) {
          console.log('Initial session loading complete');
          setLoading(false);
        }
      }
    };

    // Set up auth listener first to capture subsequent changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state change event:", _event);
      
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user || null);
      }
      
      // Use setTimeout to avoid calling Supabase functions directly within the callback
      if (newSession?.user) {
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            const profileData = await getProfileData(newSession.user!.id);
            if (profileData && isMounted) {
              setProfile(profileData);
            }
          } catch (err) {
            console.error("Error fetching profile after auth change:", err);
          }
        }, 0);
      } else if (isMounted) {
        setProfile(null);
      }
    });

    // Then load the initial session
    loadSession();

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return { session, user, profile, loading, setProfile };
};
