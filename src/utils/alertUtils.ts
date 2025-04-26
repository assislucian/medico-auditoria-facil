
// Fix the time property missing error in alertUtils.ts
// We'll add a proper time property to the notification object
import { addNotification as addNotificationAction } from '@/store/slices/notificationsSlice';
import { store } from '@/store';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  description: string;
  type: AlertType;
  link: string;
  read: boolean;
  createdAt: Date;
  time: string; // Added the missing time property
  data: Record<string, any>;
}

/**
 * Add a notification to the notifications store
 */
export const addNotification = (
  title: string,
  message: string,
  description: string,
  type: AlertType = 'info',
  link: string = '',
  data: Record<string, any> = {}
) => {
  // Get the current time in HH:MM format
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;

  store.dispatch(
    addNotificationAction({
      title,
      message,
      description,
      type,
      link,
      data,
      time, // Add the time property to fix the error
    })
  );
};

/**
 * Hook for simplified alert functions
 */
export const useAlert = () => {
  const showSuccess = (title: string, message: string) => {
    addNotification(title, message, message, 'success');
  };

  const showError = (title: string, message: string) => {
    addNotification(title, message, message, 'error');
  };

  const showWarning = (title: string, message: string) => {
    addNotification(title, message, message, 'warning');
  };

  const showInfo = (title: string, message: string) => {
    addNotification(title, message, message, 'info');
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
