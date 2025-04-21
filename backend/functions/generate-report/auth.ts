
// Authentication helper

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = 'https://yzrovzblelpnftlegczx.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return {
      error: {
        message: 'Missing authorization header',
        status: 401
      }
    };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return {
      error: {
        message: 'Unauthorized',
        status: 401
      }
    };
  }
  return { user };
}

