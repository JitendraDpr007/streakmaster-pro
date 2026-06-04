export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          achievements: string[]
          college: string | null
          created_at: string
          daily_goal: number
          email: string | null
          experience_level: string | null
          goal_companies: string[] | null
          id: string
          last_active_date: string | null
          longest_streak: number
          name: string
          onboarded: boolean
          streak: number
          target: string | null
          updated_at: string
          xp: number
        }
        Insert: {
          achievements?: string[]
          college?: string | null
          created_at?: string
          daily_goal?: number
          email?: string | null
          experience_level?: string | null
          goal_companies?: string[] | null
          id: string
          last_active_date?: string | null
          longest_streak?: number
          name?: string
          onboarded?: boolean
          streak?: number
          target?: string | null
          updated_at?: string
          xp?: number
        }
        Update: {
          achievements?: string[]
          college?: string | null
          created_at?: string
          daily_goal?: number
          email?: string | null
          experience_level?: string | null
          goal_companies?: string[] | null
          id?: string
          last_active_date?: string | null
          longest_streak?: number
          name?: string
          onboarded?: boolean
          streak?: number
          target?: string | null
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          companies: string[]
          complexity: string | null
          correct_index: number
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          explanation: string
          followup: string | null
          icon: string | null
          id: string
          interview_tip: string | null
          is_published: boolean
          options: Json
          question: string
          similar_questions: string[] | null
          slug: string | null
          story: string
          subcategory: string
          times_solved: number
          title: string
          updated_at: string
          why_others_wrong: string | null
          xp: number
        }
        Insert: {
          category: string
          companies?: string[]
          complexity?: string | null
          correct_index: number
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          explanation: string
          followup?: string | null
          icon?: string | null
          id?: string
          interview_tip?: string | null
          is_published?: boolean
          options: Json
          question: string
          similar_questions?: string[] | null
          slug?: string | null
          story: string
          subcategory: string
          times_solved?: number
          title: string
          updated_at?: string
          why_others_wrong?: string | null
          xp?: number
        }
        Update: {
          category?: string
          companies?: string[]
          complexity?: string | null
          correct_index?: number
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          explanation?: string
          followup?: string | null
          icon?: string | null
          id?: string
          interview_tip?: string | null
          is_published?: boolean
          options?: Json
          question?: string
          similar_questions?: string[] | null
          slug?: string | null
          story?: string
          subcategory?: string
          times_solved?: number
          title?: string
          updated_at?: string
          why_others_wrong?: string | null
          xp?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          author_name: string
          company: string
          contact: string
          created_at: string
          id: string
          kind: string
          note: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          company: string
          contact: string
          created_at?: string
          id?: string
          kind: string
          note: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          company?: string
          contact?: string
          created_at?: string
          id?: string
          kind?: string
          note?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          correct: boolean
          created_at: string
          id: string
          question_id: string
          selected_index: number | null
          user_id: string
          xp_awarded: number
        }
        Insert: {
          correct: boolean
          created_at?: string
          id?: string
          question_id: string
          selected_index?: number | null
          user_id: string
          xp_awarded?: number
        }
        Update: {
          correct?: boolean
          created_at?: string
          id?: string
          question_id?: string
          selected_index?: number | null
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "submissions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          college: string | null
          id: string | null
          longest_streak: number | null
          name: string | null
          streak: number | null
          xp: number | null
        }
        Insert: {
          college?: string | null
          id?: string | null
          longest_streak?: number | null
          name?: string | null
          streak?: number | null
          xp?: number | null
        }
        Update: {
          college?: string | null
          id?: string | null
          longest_streak?: number | null
          name?: string | null
          streak?: number | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      difficulty: "EASY" | "MEDIUM" | "HARD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      difficulty: ["EASY", "MEDIUM", "HARD"],
    },
  },
} as const
