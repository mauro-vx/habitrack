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
      habit_statuses: {
        Row: {
          completion_count: number | null
          created_at: string | null
          day_number: number
          habit_id: string
          id: string
          skipped_count: number | null
          status_date: string
          updated_at: string | null
        }
        Insert: {
          completion_count?: number | null
          created_at?: string | null
          day_number: number
          habit_id: string
          id?: string
          skipped_count?: number | null
          status_date: string
          updated_at?: string | null
        }
        Update: {
          completion_count?: number | null
          created_at?: string | null
          day_number?: number
          habit_id?: string
          id?: string
          skipped_count?: number | null
          status_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_statuses_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string | null
          days_of_week: Json
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string
          target_count: number
          timezone: string
          type: Database["public"]["Enums"]["habit_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_of_week?: Json
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date: string
          target_count: number
          timezone?: string
          type: Database["public"]["Enums"]["habit_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_of_week?: Json
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string
          target_count?: number
          timezone?: string
          type?: Database["public"]["Enums"]["habit_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_day_data: {
        Args: { _date: string }
        Returns: {
          id: string
          user_id: string
          name: string
          description: string
          type: Database["public"]["Enums"]["habit_type"]
          start_date: string
          end_date: string
          days_of_week: Json
          target_count: number
          created_at: string
          updated_at: string
          habit_status: Json
        }[]
      }
      fetch_month_data: {
        Args: { _month_start: string }
        Returns: {
          id: string
          user_id: string
          name: string
          description: string
          type: Database["public"]["Enums"]["habit_type"]
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          habit_statuses: Json
        }[]
      }
      fetch_week_data: {
        Args: { _startweek: string; _endweek: string } | { _week_start: string }
        Returns: {
          id: string
          user_id: string
          name: string
          description: string
          type: Database["public"]["Enums"]["habit_type"]
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          habit_statuses: Json
        }[]
      }
      get_habits_with_statuses: {
        Args: { start_week: string; end_week: string }
        Returns: {
          habit_id: number
          habit_name: string
          habit_statuses: Json
        }[]
      }
      get_user_id_by_email: {
        Args: Record<PropertyKey, never> | { email_input: string }
        Returns: {
          id: string
        }[]
      }
    }
    Enums: {
      habit_type: "daily" | "weekly" | "custom"
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
    Enums: {
      habit_type: ["daily", "weekly", "custom"],
    },
  },
} as const
