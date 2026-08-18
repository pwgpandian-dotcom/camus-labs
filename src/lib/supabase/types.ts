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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      case_studies: {
        Row: {
          created_at: string
          features: Json
          id: string
          industry: string | null
          is_published: boolean
          live_demo_url: string | null
          problem: string | null
          project_name: string
          results: string | null
          screenshots: Json
          slug: string
          solution: string | null
          technology: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          industry?: string | null
          is_published?: boolean
          live_demo_url?: string | null
          problem?: string | null
          project_name: string
          results?: string | null
          screenshots?: Json
          slug: string
          solution?: string | null
          technology?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          industry?: string | null
          is_published?: boolean
          live_demo_url?: string | null
          problem?: string | null
          project_name?: string
          results?: string | null
          screenshots?: Json
          slug?: string
          solution?: string | null
          technology?: Json
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          billing_address: string | null
          company_name: string
          created_at: string
          id: string
          profile_id: string | null
        }
        Insert: {
          billing_address?: string | null
          company_name: string
          created_at?: string
          id?: string
          profile_id?: string | null
        }
        Update: {
          billing_address?: string | null
          company_name?: string
          created_at?: string
          id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          client_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          lead_id: string | null
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["consultation_status"]
          type: Database["public"]["Enums"]["consultation_type"]
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["consultation_status"]
          type?: Database["public"]["Enums"]["consultation_type"]
        }
        Update: {
          client_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["consultation_status"]
          type?: Database["public"]["Enums"]["consultation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "consultations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          client_id: string | null
          created_at: string
          file_url: string
          id: string
          project_id: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          client_id?: string | null
          created_at?: string
          file_url: string
          id?: string
          project_id?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          client_id?: string | null
          created_at?: string
          file_url?: string
          id?: string
          project_id?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          project_id: string | null
          read_at: string | null
          recipient_id: string | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          project_id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id: string
          thread_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          project_id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          project_id: string
          sort_order: number
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          project_id: string
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          budget_range: string | null
          build_type: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          idea_description: string
          industry: string | null
          lead_id: string | null
          reference_number: string
          status: Database["public"]["Enums"]["request_status"]
          timeline: string | null
          wants_consultation: boolean
        }
        Insert: {
          budget_range?: string | null
          build_type: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          idea_description: string
          industry?: string | null
          lead_id?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["request_status"]
          timeline?: string | null
          wants_consultation?: boolean
        }
        Update: {
          budget_range?: string | null
          build_type?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          idea_description?: string
          industry?: string | null
          lead_id?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["request_status"]
          timeline?: string | null
          wants_consultation?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          current_milestone_id: string | null
          id: string
          name: string
          next_milestone_id: string | null
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          summary: string | null
          target_launch_date: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_milestone_id?: string | null
          id?: string
          name: string
          next_milestone_id?: string | null
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          summary?: string | null
          target_launch_date?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_milestone_id?: string | null
          id?: string
          name?: string
          next_milestone_id?: string | null
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          summary?: string | null
          target_launch_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_current_milestone_fk"
            columns: ["current_milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_next_milestone_fk"
            columns: ["next_milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          due_date: string | null
          id: string
          milestone_id: string | null
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          milestone_id?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          milestone_id?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_client_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      consultation_status: "requested" | "confirmed" | "completed" | "cancelled"
      consultation_type: "discovery" | "technical" | "proposal" | "support"
      document_category:
        | "contract"
        | "requirement"
        | "design"
        | "report"
        | "other"
      lead_status: "new" | "contacted" | "qualified" | "archived"
      milestone_status: "pending" | "in_progress" | "completed" | "blocked"
      payment_status: "pending" | "paid" | "overdue" | "refunded"
      project_status:
        | "discovery"
        | "design"
        | "development"
        | "testing"
        | "deployed"
        | "launched"
        | "on_hold"
      request_status:
        | "received"
        | "reviewing"
        | "proposal_sent"
        | "accepted"
        | "declined"
      task_status: "todo" | "in_progress" | "review" | "done"
      user_role: "client" | "operator" | "sales" | "admin"
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
      consultation_status: ["requested", "confirmed", "completed", "cancelled"],
      consultation_type: ["discovery", "technical", "proposal", "support"],
      document_category: [
        "contract",
        "requirement",
        "design",
        "report",
        "other",
      ],
      lead_status: ["new", "contacted", "qualified", "archived"],
      milestone_status: ["pending", "in_progress", "completed", "blocked"],
      payment_status: ["pending", "paid", "overdue", "refunded"],
      project_status: [
        "discovery",
        "design",
        "development",
        "testing",
        "deployed",
        "launched",
        "on_hold",
      ],
      request_status: [
        "received",
        "reviewing",
        "proposal_sent",
        "accepted",
        "declined",
      ],
      task_status: ["todo", "in_progress", "review", "done"],
      user_role: ["client", "operator", "sales", "admin"],
    },
  },
} as const
