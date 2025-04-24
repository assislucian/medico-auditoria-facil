
import { createContext } from 'react';

export interface AuthContextProps {
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  loading: true,
  isAuthenticated: false
});

export default AuthContext;
