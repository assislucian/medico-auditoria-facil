
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string; // ISO string
  read: boolean;
  type: NotificationType;
  link?: string;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    
    // Load notifications from localStorage to start with something
    const savedNotifications = localStorage.getItem('medcheck_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Failed to parse saved notifications", error);
      }
    }

    // For the MVP, we'll just use localStorage to store notifications
    // In the future, this would be replaced with actual database calls
    
    // Simulating a real-time notification for demo purposes
    const interval = setInterval(() => {
      // This would normally come from a Supabase real-time subscription
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Save to localStorage
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem('medcheck_notifications', JSON.stringify(updatedNotifications));
    
    // Show toast notification
    toast(notification.title, {
      description: notification.description,
      action: notification.link ? {
        label: "Visualizar",
        onClick: () => window.location.href = notification.link!
      } : undefined
    });
    
    // When database is ready, uncomment this code:
    /*
    if (user) {
      try {
        supabase.from('user_notifications').insert({
          user_id: user.id,
          title: notification.title,
          description: notification.description,
          type: notification.type,
          link: notification.link,
          data: notification.data
        }).then(({ error }) => {
          if (error) console.error("Failed to save notification to database", error);
        });
      } catch (error) {
        console.error("Failed to save notification", error);
      }
    }
    */
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Update localStorage
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    localStorage.setItem('medcheck_notifications', JSON.stringify(updatedNotifications));
    
    // Update database if available (future implementation)
    /*
    if (user) {
      try {
        supabase
          .from('user_notifications')
          .update({ read: true })
          .eq('id', id)
          .eq('user_id', user.id)
          .then(({ error }) => {
            if (error) console.error("Failed to update notification in database", error);
          });
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    */
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    // Update localStorage
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    localStorage.setItem('medcheck_notifications', JSON.stringify(updatedNotifications));
    
    // Update database if available (future implementation)
    /*
    if (user) {
      try {
        supabase
          .from('user_notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .in('id', notifications.filter(n => !n.read).map(n => n.id))
          .then(({ error }) => {
            if (error) console.error("Failed to update all notifications in database", error);
          });
      } catch (error) {
        console.error("Failed to mark all notifications as read", error);
      }
    }
    */
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    
    // Update localStorage
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    localStorage.setItem('medcheck_notifications', JSON.stringify(updatedNotifications));
    
    // Remove from database if available (future implementation)
    /*
    if (user) {
      try {
        supabase
          .from('user_notifications')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)
          .then(({ error }) => {
            if (error) console.error("Failed to delete notification from database", error);
          });
      } catch (error) {
        console.error("Failed to remove notification", error);
      }
    }
    */
  };

  const clearNotifications = () => {
    setNotifications([]);
    
    // Clear localStorage
    localStorage.removeItem('medcheck_notifications');
    
    // Clear database notifications if available (future implementation)
    /*
    if (user) {
      try {
        supabase
          .from('user_notifications')
          .delete()
          .eq('user_id', user.id)
          .then(({ error }) => {
            if (error) console.error("Failed to clear all notifications from database", error);
          });
      } catch (error) {
        console.error("Failed to clear notifications", error);
      }
    }
    */
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
