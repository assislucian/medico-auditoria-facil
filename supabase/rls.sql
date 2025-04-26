
-- Export of public schema RLS policies
ALTER TABLE "public"."procedures" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own procedures"
ON "public"."procedures"
AS PERMISSIVE
FOR ALL
TO public
USING (auth.uid() = user_id);

-- Additional tables' RLS policies would be listed here
