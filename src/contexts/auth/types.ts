
export interface AuthContextProps {
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  user?: any;
  profile?: any;
  signInWithPassword?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string) => Promise<any>;
  signOut?: () => Promise<any>;
  getProfile?: () => Promise<any>;
  updatePassword?: (password: string) => Promise<any>;
}
