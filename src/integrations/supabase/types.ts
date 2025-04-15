export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          description: string
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      analysis_history: {
        Row: {
          date: string
          description: string
          glosados: number | null
          hospital: string | null
          id: string
          procedimentos: number | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          date?: string
          description: string
          glosados?: number | null
          hospital?: string | null
          id?: string
          procedimentos?: number | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          date?: string
          description?: string
          glosados?: number | null
          hospital?: string | null
          id?: string
          procedimentos?: number | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      CBHPM2015: {
        Row: {
          codigo: number | null
          cust_oper: string | null
          n_aux: string | null
          porte_anest: string | null
          porte_cirurgiao: string | null
          procedimento: string | null
          valor_anestesista: string | null
          valor_cirurgiao: string | null
        }
        Insert: {
          codigo?: number | null
          cust_oper?: string | null
          n_aux?: string | null
          porte_anest?: string | null
          porte_cirurgiao?: string | null
          procedimento?: string | null
          valor_anestesista?: string | null
          valor_cirurgiao?: string | null
        }
        Update: {
          codigo?: number | null
          cust_oper?: string | null
          n_aux?: string | null
          porte_anest?: string | null
          porte_cirurgiao?: string | null
          procedimento?: string | null
          valor_anestesista?: string | null
          valor_cirurgiao?: string | null
        }
        Relationships: []
      }
      help_articles: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          published: boolean
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          published?: boolean
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      procedures: {
        Row: {
          analysis_id: string
          beneficiario: string | null
          codigo: string
          diferenca: number | null
          doctors: Json | null
          guia: string | null
          id: string
          pago: boolean | null
          papel: string | null
          procedimento: string
          user_id: string
          valor_cbhpm: number | null
          valor_pago: number | null
        }
        Insert: {
          analysis_id: string
          beneficiario?: string | null
          codigo: string
          diferenca?: number | null
          doctors?: Json | null
          guia?: string | null
          id?: string
          pago?: boolean | null
          papel?: string | null
          procedimento: string
          user_id: string
          valor_cbhpm?: number | null
          valor_pago?: number | null
        }
        Update: {
          analysis_id?: string
          beneficiario?: string | null
          codigo?: string
          diferenca?: number | null
          doctors?: Json | null
          guia?: string | null
          id?: string
          pago?: boolean | null
          papel?: string | null
          procedimento?: string
          user_id?: string
          valor_cbhpm?: number | null
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "procedures_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_history"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          crm: string
          email: string
          id: string
          name: string
          specialty: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crm: string
          email: string
          id: string
          name: string
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crm?: string
          email?: string
          id?: string
          name?: string
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sent_by_user: boolean
          ticket_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sent_by_user?: boolean
          ticket_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sent_by_user?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          file_name: string
          file_path: string
          file_type: string
          hospital: string | null
          id: string
          metadata: Json | null
          status: string
          upload_date: string
          user_id: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_type: string
          hospital?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_type?: string
          hospital?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
