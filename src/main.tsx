
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './hooks/use-theme'
import { NotificationProvider } from './contexts/NotificationContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Font loading check
const checkFontsLoaded = () => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      console.log('Fonts loaded successfully');
      document.documentElement.classList.add('fonts-loaded');
    }).catch(err => {
      console.error('Error loading fonts:', err);
    });
  }
};

// Call font loading check
checkFontsLoaded();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="medcheck-theme">
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
