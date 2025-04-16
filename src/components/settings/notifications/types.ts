
import { Json } from "@/integrations/supabase/types";

export interface EmailPreferences {
  newReports: boolean;
  systemUpdates: boolean;
  tips: boolean;
  newsletter: boolean;
}

export interface SmsPreferences {
  criticalAlerts: boolean;
  paymentRecovery: boolean;
  invoiceReminders: boolean;
}

export interface NotificationPreferences {
  email: EmailPreferences;
  sms: SmsPreferences;
}

// Default notification preferences used across components
export const defaultNotificationPreferences: NotificationPreferences = {
  email: {
    newReports: true,
    systemUpdates: true,
    tips: false,
    newsletter: false
  },
  sms: {
    criticalAlerts: true,
    paymentRecovery: false,
    invoiceReminders: false
  }
};

// Helper function to safely parse notification preferences from database
export function parseNotificationPreferences(data: Json | null): NotificationPreferences {
  if (!data) return defaultNotificationPreferences;
  
  try {
    // Type assertion with validation
    const parsed = data as any;
    if (parsed && 
        typeof parsed === 'object' && 
        parsed.email && 
        parsed.sms) {
      return parsed as NotificationPreferences;
    }
  } catch (e) {
    console.error("Error parsing notification preferences:", e);
  }
  
  return defaultNotificationPreferences;
}

// Helper function to convert notification preferences to Json type
export function notificationPreferencesToJson(prefs: NotificationPreferences): Json {
  return prefs as unknown as Json;
}
