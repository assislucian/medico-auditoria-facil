
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
