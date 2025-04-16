
import { Json } from "@/integrations/supabase/types";

/**
 * Interface for a reference table or medical role
 */
export interface ReferenceTable {
  id: string;
  name: string;
  description?: string;
  category: 'table' | 'role';
  checked: boolean;
}

/**
 * Interface for reference tables preferences
 */
export interface ReferenceTablesPreferences {
  tables: ReferenceTable[];
  roles: ReferenceTable[];
}

/**
 * Default empty preferences object
 */
export const defaultReferenceTablesPreferences: ReferenceTablesPreferences = {
  tables: [],
  roles: []
};

/**
 * Helper function to safely parse reference tables preferences from database
 * @param data - Raw data from the database
 * @returns Typed ReferenceTablesPreferences object
 */
export function parseReferenceTablesPreferences(data: Json | null): ReferenceTablesPreferences {
  if (!data) return defaultReferenceTablesPreferences;
  
  try {
    const parsed = data as any;
    if (parsed && 
        typeof parsed === 'object' && 
        Array.isArray(parsed.tables) && 
        Array.isArray(parsed.roles)) {
      return parsed as ReferenceTablesPreferences;
    }
  } catch (e) {
    console.error("Error parsing reference tables preferences:", e);
  }
  
  return defaultReferenceTablesPreferences;
}

/**
 * Helper function to convert reference tables preferences to Json type
 * @param prefs - Reference tables preferences object
 * @returns Json-compatible object for database storage
 */
export function referenceTablesPreferencesToJson(prefs: ReferenceTablesPreferences): Json {
  return prefs as unknown as Json;
}
