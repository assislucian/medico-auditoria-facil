
/**
 * types.ts
 * 
 * Define os tipos para o contexto de autenticação.
 * Utilizado para fornecer tipagem forte ao sistema de autenticação.
 */

import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';

/**
 * Interface que define as propriedades disponíveis no contexto de autenticação.
 * Inclui os dados do usuário, funções de autenticação e gerenciamento de perfil.
 */
export interface AuthContextProps {
  session: Session | null;              // Sessão atual do usuário
  user: User | null;                    // Dados do usuário autenticado
  profile: Profile | null;              // Perfil do usuário com dados adicionais
  loading: boolean;                     // Indica se a autenticação está carregando
  
  // Funções de autenticação
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  
  // Funções de perfil
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
}
