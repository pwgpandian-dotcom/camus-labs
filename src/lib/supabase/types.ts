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
      arthaa_access_credentials: {
        Row: {
          allowed_from: string | null
          allowed_to: string | null
          created_at: string
          created_by: string | null
          credential_hash: string
          holder_type: string
          id: string
          label: string | null
          last4: string | null
          property_id: string
          staff_id: string | null
          status: string
          tenant_id: string | null
          updated_at: string
          valid_from: string
          valid_to: string | null
          visitor_name: string | null
        }
        Insert: {
          allowed_from?: string | null
          allowed_to?: string | null
          created_at?: string
          created_by?: string | null
          credential_hash: string
          holder_type: string
          id?: string
          label?: string | null
          last4?: string | null
          property_id: string
          staff_id?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
          visitor_name?: string | null
        }
        Update: {
          allowed_from?: string | null
          allowed_to?: string | null
          created_at?: string
          created_by?: string | null
          credential_hash?: string
          holder_type?: string
          id?: string
          label?: string | null
          last4?: string | null
          property_id?: string
          staff_id?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
          visitor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_access_credentials_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_access_credentials_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "arthaa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_access_credentials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_access_credentials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_access_logs: {
        Row: {
          credential_id: string | null
          event: string
          gate: string | null
          id: number
          occurred_at: string
          property_id: string
          source: string
        }
        Insert: {
          credential_id?: string | null
          event: string
          gate?: string | null
          id?: never
          occurred_at?: string
          property_id: string
          source?: string
        }
        Update: {
          credential_id?: string | null
          event?: string
          gate?: string | null
          id?: never
          occurred_at?: string
          property_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_access_logs_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "arthaa_access_credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_access_logs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_alerts: {
        Row: {
          acknowledged_at: string | null
          body: string | null
          category: string
          created_at: string
          department: string | null
          id: string
          priority: string
          property_id: string | null
          resolved_at: string | null
          source_id: string | null
          source_table: string | null
          status: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          body?: string | null
          category: string
          created_at?: string
          department?: string | null
          id?: string
          priority?: string
          property_id?: string | null
          resolved_at?: string | null
          source_id?: string | null
          source_table?: string | null
          status?: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          body?: string | null
          category?: string
          created_at?: string
          department?: string | null
          id?: string
          priority?: string
          property_id?: string | null
          resolved_at?: string | null
          source_id?: string | null
          source_table?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_alerts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_amenities: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      arthaa_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          actor_role: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: number
          meta: Json | null
          property_id: string | null
          summary: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          actor_role?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: never
          meta?: Json | null
          property_id?: string | null
          summary: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          actor_role?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: never
          meta?: Json | null
          property_id?: string | null
          summary?: string
        }
        Relationships: []
      }
      arthaa_beds: {
        Row: {
          bed_label: string
          created_at: string
          id: string
          room_id: string | null
          status: string
        }
        Insert: {
          bed_label: string
          created_at?: string
          id?: string
          room_id?: string | null
          status?: string
        }
        Update: {
          bed_label?: string
          created_at?: string
          id?: string
          room_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_beds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "arthaa_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_beds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["room_id"]
          },
        ]
      }
      arthaa_bookings: {
        Row: {
          booking_date: string
          cancelled_at: string | null
          created_at: string
          created_by: string | null
          end_min: number
          id: string
          kind: string
          property_id: string
          purpose: string | null
          resource_id: string
          start_min: number
          status: string
          tenant_id: string | null
        }
        Insert: {
          booking_date: string
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          end_min: number
          id?: string
          kind: string
          property_id: string
          purpose?: string | null
          resource_id: string
          start_min: number
          status?: string
          tenant_id?: string | null
        }
        Update: {
          booking_date?: string
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          end_min?: number
          id?: string
          kind?: string
          property_id?: string
          purpose?: string | null
          resource_id?: string
          start_min?: number
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_bookings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "arthaa_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_branch_info: {
        Row: {
          breakfast_time: string | null
          dinner_time: string | null
          emergency_note: string | null
          faq: Json
          gate_instructions: string | null
          house_rules: string | null
          laundry_instructions: string | null
          lunch_time: string | null
          property_id: string
          updated_at: string
          wifi_instructions: string | null
          wifi_password: string | null
          wifi_ssid: string | null
        }
        Insert: {
          breakfast_time?: string | null
          dinner_time?: string | null
          emergency_note?: string | null
          faq?: Json
          gate_instructions?: string | null
          house_rules?: string | null
          laundry_instructions?: string | null
          lunch_time?: string | null
          property_id: string
          updated_at?: string
          wifi_instructions?: string | null
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Update: {
          breakfast_time?: string | null
          dinner_time?: string | null
          emergency_note?: string | null
          faq?: Json
          gate_instructions?: string | null
          house_rules?: string | null
          laundry_instructions?: string | null
          lunch_time?: string | null
          property_id?: string
          updated_at?: string
          wifi_instructions?: string | null
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_branch_info_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_buildings: {
        Row: {
          created_at: string
          floors_count: number
          id: string
          name: string
          property_id: string
        }
        Insert: {
          created_at?: string
          floors_count?: number
          id?: string
          name: string
          property_id: string
        }
        Update: {
          created_at?: string
          floors_count?: number
          id?: string
          name?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_buildings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_cameras: {
        Row: {
          created_at: string
          id: string
          integration_status: string
          last_checked_at: string | null
          last_heartbeat: string | null
          location: string | null
          name: string
          property_id: string
          provider: string | null
          status: string
          stream_ref: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          integration_status?: string
          last_checked_at?: string | null
          last_heartbeat?: string | null
          location?: string | null
          name: string
          property_id: string
          provider?: string | null
          status?: string
          stream_ref?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          integration_status?: string
          last_checked_at?: string | null
          last_heartbeat?: string | null
          location?: string | null
          name?: string
          property_id?: string
          provider?: string | null
          status?: string
          stream_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_cameras_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_complaints: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          priority: string
          resolution_note: string | null
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          resolution_note?: string | null
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          resolution_note?: string | null
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_complaints_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_complaints_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_enquiries: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string
          sharing_type: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          sharing_type?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          sharing_type?: string | null
          status?: string
        }
        Relationships: []
      }
      arthaa_expense_categories: {
        Row: {
          active: boolean
          group_name: string
          id: string
          is_custom: boolean
          name: string
        }
        Insert: {
          active?: boolean
          group_name: string
          id?: string
          is_custom?: boolean
          name: string
        }
        Update: {
          active?: boolean
          group_name?: string
          id?: string
          is_custom?: boolean
          name?: string
        }
        Relationships: []
      }
      arthaa_expenses: {
        Row: {
          added_by: string | null
          amount: number
          category_id: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
          notes: string | null
          property_id: string
          receipt_url: string | null
          source_id: string | null
          source_table: string | null
          vendor: string | null
        }
        Insert: {
          added_by?: string | null
          amount: number
          category_id: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          property_id: string
          receipt_url?: string | null
          source_id?: string | null
          source_table?: string | null
          vendor?: string | null
        }
        Update: {
          added_by?: string | null
          amount?: number
          category_id?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          property_id?: string
          receipt_url?: string | null
          source_id?: string | null
          source_table?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "arthaa_expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_food_menu: {
        Row: {
          day_of_week: string
          id: string
          items: string
          meal_type: string
          property_id: string | null
        }
        Insert: {
          day_of_week: string
          id?: string
          items: string
          meal_type: string
          property_id?: string | null
        }
        Update: {
          day_of_week?: string
          id?: string
          items?: string
          meal_type?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_food_menu_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_food_requests: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          id: string
          item: string | null
          kind: string
          meal_type: string | null
          note: string | null
          property_id: string
          resolved_at: string | null
          status: string
          tenant_id: string | null
          ticket_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          item?: string | null
          kind?: string
          meal_type?: string | null
          note?: string | null
          property_id: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          item?: string | null
          kind?: string
          meal_type?: string | null
          note?: string | null
          property_id?: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_food_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_food_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_food_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_housekeeping_tasks: {
        Row: {
          area: string | null
          assigned_staff_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          due_at: string | null
          id: string
          notes: string | null
          photo_url: string | null
          priority: string
          proof_required: boolean
          property_id: string
          room_id: string | null
          started_at: string | null
          status: string
          task_type: string
          ticket_id: string | null
          verified_at: string | null
        }
        Insert: {
          area?: string | null
          assigned_staff_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          priority?: string
          proof_required?: boolean
          property_id: string
          room_id?: string | null
          started_at?: string | null
          status?: string
          task_type?: string
          ticket_id?: string | null
          verified_at?: string | null
        }
        Update: {
          area?: string | null
          assigned_staff_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          priority?: string
          proof_required?: boolean
          property_id?: string
          room_id?: string | null
          started_at?: string | null
          status?: string
          task_type?: string
          ticket_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_housekeeping_tasks_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "arthaa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_housekeeping_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_housekeeping_tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "arthaa_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_housekeeping_tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["room_id"]
          },
        ]
      }
      arthaa_integrations: {
        Row: {
          config: Json
          id: string
          kind: string
          last_heartbeat: string | null
          notes: string | null
          property_id: string | null
          provider: string | null
          status: string
          updated_at: string
        }
        Insert: {
          config?: Json
          id?: string
          kind: string
          last_heartbeat?: string | null
          notes?: string | null
          property_id?: string | null
          provider?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          id?: string
          kind?: string
          last_heartbeat?: string | null
          notes?: string | null
          property_id?: string | null
          provider?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_integrations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_laundry_machines: {
        Row: {
          close_time: string
          created_at: string
          id: string
          iot_status: string
          location: string | null
          machine_code: string
          open_time: string
          property_id: string
          slot_minutes: number
          status: string
        }
        Insert: {
          close_time?: string
          created_at?: string
          id?: string
          iot_status?: string
          location?: string | null
          machine_code: string
          open_time?: string
          property_id: string
          slot_minutes?: number
          status?: string
        }
        Update: {
          close_time?: string
          created_at?: string
          id?: string
          iot_status?: string
          location?: string | null
          machine_code?: string
          open_time?: string
          property_id?: string
          slot_minutes?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_laundry_machines_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_maintenance_requests: {
        Row: {
          assigned_staff_id: string | null
          category: string
          completed_at: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          photo_url: string | null
          priority: string
          property_id: string
          resolution: string | null
          room_id: string | null
          status: string
          tenant_id: string | null
          ticket_id: string | null
          title: string
          vendor: string | null
          verified_at: string | null
        }
        Insert: {
          assigned_staff_id?: string | null
          category?: string
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          photo_url?: string | null
          priority?: string
          property_id: string
          resolution?: string | null
          room_id?: string | null
          status?: string
          tenant_id?: string | null
          ticket_id?: string | null
          title: string
          vendor?: string | null
          verified_at?: string | null
        }
        Update: {
          assigned_staff_id?: string | null
          category?: string
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          photo_url?: string | null
          priority?: string
          property_id?: string
          resolution?: string | null
          room_id?: string | null
          status?: string
          tenant_id?: string | null
          ticket_id?: string | null
          title?: string
          vendor?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_maintenance_requests_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "arthaa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_maintenance_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "arthaa_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_maintenance_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "arthaa_maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          tenant_id: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          tenant_id?: string | null
          title: string
          type?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          tenant_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_payment_settings: {
        Row: {
          active: boolean
          instructions: string | null
          payee_name: string | null
          property_id: string
          qr_image_path: string | null
          updated_at: string
          upi_vpa: string | null
        }
        Insert: {
          active?: boolean
          instructions?: string | null
          payee_name?: string | null
          property_id: string
          qr_image_path?: string | null
          updated_at?: string
          upi_vpa?: string | null
        }
        Update: {
          active?: boolean
          instructions?: string | null
          payee_name?: string | null
          property_id?: string
          qr_image_path?: string | null
          updated_at?: string
          upi_vpa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_payment_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_payment_submissions: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_on: string
          payment_id: string
          property_id: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          screenshot_path: string | null
          status: string
          tenant_id: string
          utr: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paid_on?: string
          payment_id: string
          property_id?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_path?: string | null
          status?: string
          tenant_id: string
          utr?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_on?: string
          payment_id?: string
          property_id?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_path?: string | null
          status?: string
          tenant_id?: string
          utr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_payment_submissions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "arthaa_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_payment_submissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_payment_submissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_payment_submissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_payments: {
        Row: {
          amount: number
          amount_paid: number
          created_at: string
          due_date: string | null
          id: string
          method: string | null
          month: string
          notes: string | null
          paid_date: string | null
          recorded_by: string | null
          status: string
          tenant_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          amount_paid?: number
          created_at?: string
          due_date?: string | null
          id?: string
          method?: string | null
          month: string
          notes?: string | null
          paid_date?: string | null
          recorded_by?: string | null
          status?: string
          tenant_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          amount_paid?: number
          created_at?: string
          due_date?: string | null
          id?: string
          method?: string | null
          month?: string
          notes?: string | null
          paid_date?: string | null
          recorded_by?: string | null
          status?: string
          tenant_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      arthaa_properties: {
        Row: {
          address: string | null
          amenities: string[] | null
          branch_code: string | null
          city: string | null
          contact_phone: string | null
          created_at: string
          default_deposit: number | null
          description: string | null
          food_available: boolean | null
          hero_image_url: string | null
          housekeeping_available: boolean | null
          id: string
          is_active: boolean | null
          laundry_available: boolean | null
          maps_url: string | null
          name: string
          property_name: string | null
          security_details: string | null
          sharing_rents: Json | null
          tagline: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          branch_code?: string | null
          city?: string | null
          contact_phone?: string | null
          created_at?: string
          default_deposit?: number | null
          description?: string | null
          food_available?: boolean | null
          hero_image_url?: string | null
          housekeeping_available?: boolean | null
          id?: string
          is_active?: boolean | null
          laundry_available?: boolean | null
          maps_url?: string | null
          name: string
          property_name?: string | null
          security_details?: string | null
          sharing_rents?: Json | null
          tagline?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          branch_code?: string | null
          city?: string | null
          contact_phone?: string | null
          created_at?: string
          default_deposit?: number | null
          description?: string | null
          food_available?: boolean | null
          hero_image_url?: string | null
          housekeeping_available?: boolean | null
          id?: string
          is_active?: boolean | null
          laundry_available?: boolean | null
          maps_url?: string | null
          name?: string
          property_name?: string | null
          security_details?: string | null
          sharing_rents?: Json | null
          tagline?: string | null
        }
        Relationships: []
      }
      arthaa_push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          profile_id: string
          user_agent: string | null
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          profile_id: string
          user_agent?: string | null
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          profile_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      arthaa_reminder_log: {
        Row: {
          id: string
          kind: string
          payment_id: string
          sent_at: string
        }
        Insert: {
          id?: string
          kind: string
          payment_id: string
          sent_at?: string
        }
        Update: {
          id?: string
          kind?: string
          payment_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_reminder_log_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "arthaa_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_reminder_settings: {
        Row: {
          days_before: number[]
          enabled: boolean
          on_due_date: boolean
          overdue_enabled: boolean
          overdue_repeat_days: number
          property_id: string
          updated_at: string
        }
        Insert: {
          days_before?: number[]
          enabled?: boolean
          on_due_date?: boolean
          overdue_enabled?: boolean
          overdue_repeat_days?: number
          property_id: string
          updated_at?: string
        }
        Update: {
          days_before?: number[]
          enabled?: boolean
          on_due_date?: boolean
          overdue_enabled?: boolean
          overdue_repeat_days?: number
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_reminder_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_resources: {
        Row: {
          advance_days: number
          capacity: number | null
          close_time: string
          created_at: string
          id: string
          iot_status: string
          kind: string
          location: string | null
          max_slots_per_day: number
          name: string
          notes: string | null
          open_time: string
          property_id: string
          slot_minutes: number
          status: string
        }
        Insert: {
          advance_days?: number
          capacity?: number | null
          close_time?: string
          created_at?: string
          id?: string
          iot_status?: string
          kind: string
          location?: string | null
          max_slots_per_day?: number
          name: string
          notes?: string | null
          open_time?: string
          property_id: string
          slot_minutes?: number
          status?: string
        }
        Update: {
          advance_days?: number
          capacity?: number | null
          close_time?: string
          created_at?: string
          id?: string
          iot_status?: string
          kind?: string
          location?: string | null
          max_slots_per_day?: number
          name?: string
          notes?: string | null
          open_time?: string
          property_id?: string
          slot_minutes?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_resources_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_rooms: {
        Row: {
          building_id: string | null
          created_at: string
          deposit: number | null
          floor: number
          id: string
          monthly_rent: number
          property_id: string | null
          room_number: string
          sharing_type: string
          status: string
          total_beds: number
        }
        Insert: {
          building_id?: string | null
          created_at?: string
          deposit?: number | null
          floor: number
          id?: string
          monthly_rent: number
          property_id?: string | null
          room_number: string
          sharing_type: string
          status?: string
          total_beds: number
        }
        Update: {
          building_id?: string | null
          created_at?: string
          deposit?: number | null
          floor?: number
          id?: string
          monthly_rent?: number
          property_id?: string | null
          room_number?: string
          sharing_type?: string
          status?: string
          total_beds?: number
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_rooms_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "arthaa_buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_security_incidents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          property_id: string
          reported_by: string | null
          resolved_at: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          property_id: string
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          property_id?: string
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_security_incidents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_staff: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          joining_date: string | null
          login_enabled: boolean
          phone: string | null
          profile_id: string | null
          property_id: string | null
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          joining_date?: string | null
          login_enabled?: boolean
          phone?: string | null
          profile_id?: string | null
          property_id?: string | null
          role: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          joining_date?: string | null
          login_enabled?: boolean
          phone?: string | null
          profile_id?: string | null
          property_id?: string | null
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "arthaa_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_staff_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_support_contacts: {
        Row: {
          active: boolean
          department: string
          email: string | null
          id: string
          is_emergency: boolean
          name: string | null
          phone: string | null
          property_id: string
          support_hours: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          active?: boolean
          department: string
          email?: string | null
          id?: string
          is_emergency?: boolean
          name?: string | null
          phone?: string | null
          property_id: string
          support_hours?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          active?: boolean
          department?: string
          email?: string | null
          id?: string
          is_emergency?: boolean
          name?: string | null
          phone?: string | null
          property_id?: string
          support_hours?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_support_contacts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_support_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          property_id: string | null
          status: string
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          property_id?: string | null
          status?: string
          tenant_id: string
          title?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          property_id?: string | null
          status?: string
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_support_conversations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_support_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_support_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_support_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          payload: Json | null
          sender_id: string | null
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          payload?: Json | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          payload?: Json | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_support_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "arthaa_support_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_support_tickets: {
        Row: {
          assigned_staff_id: string | null
          assigned_team: string | null
          category: string
          closed_at: string | null
          conversation_id: string | null
          created_at: string
          department: string
          description: string | null
          escalated: boolean
          first_response_at: string | null
          id: string
          linked_id: string | null
          linked_table: string | null
          location_label: string | null
          photo_url: string | null
          priority: string
          property_id: string | null
          resolved_at: string | null
          source: string
          status: string
          tenant_id: string | null
          ticket_no: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_staff_id?: string | null
          assigned_team?: string | null
          category?: string
          closed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          department: string
          description?: string | null
          escalated?: boolean
          first_response_at?: string | null
          id?: string
          linked_id?: string | null
          linked_table?: string | null
          location_label?: string | null
          photo_url?: string | null
          priority?: string
          property_id?: string | null
          resolved_at?: string | null
          source?: string
          status?: string
          tenant_id?: string | null
          ticket_no: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_staff_id?: string | null
          assigned_team?: string | null
          category?: string
          closed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          department?: string
          description?: string | null
          escalated?: boolean
          first_response_at?: string | null
          id?: string
          linked_id?: string | null
          linked_table?: string | null
          location_label?: string | null
          photo_url?: string | null
          priority?: string
          property_id?: string | null
          resolved_at?: string | null
          source?: string
          status?: string
          tenant_id?: string | null
          ticket_no?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_support_tickets_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "arthaa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_support_tickets_conv_fk"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "arthaa_support_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_support_tickets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_support_tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_support_tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_tenants: {
        Row: {
          bed_id: string | null
          created_at: string
          deposit_amount: number | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          full_name: string
          id: string
          joining_date: string | null
          kyc_doc_url: string | null
          kyc_status: string | null
          monthly_rent: number | null
          move_out_date: string | null
          notice_date: string | null
          notice_status: string | null
          outstanding_amount: number | null
          phone: string | null
          photo_url: string | null
          profile_id: string | null
          property_id: string | null
          rent_due_day: number | null
          status: string
        }
        Insert: {
          bed_id?: string | null
          created_at?: string
          deposit_amount?: number | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          full_name: string
          id?: string
          joining_date?: string | null
          kyc_doc_url?: string | null
          kyc_status?: string | null
          monthly_rent?: number | null
          move_out_date?: string | null
          notice_date?: string | null
          notice_status?: string | null
          outstanding_amount?: number | null
          phone?: string | null
          photo_url?: string | null
          profile_id?: string | null
          property_id?: string | null
          rent_due_day?: number | null
          status?: string
        }
        Update: {
          bed_id?: string | null
          created_at?: string
          deposit_amount?: number | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          full_name?: string
          id?: string
          joining_date?: string | null
          kyc_doc_url?: string | null
          kyc_status?: string | null
          monthly_rent?: number | null
          move_out_date?: string | null
          notice_date?: string | null
          notice_status?: string | null
          outstanding_amount?: number | null
          phone?: string | null
          photo_url?: string | null
          profile_id?: string | null
          property_id?: string | null
          rent_due_day?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_tenants_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "arthaa_beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_tenants_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["bed_id"]
          },
          {
            foreignKeyName: "arthaa_tenants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "arthaa_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      arthaa_visitors: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          created_at: string
          created_by: string | null
          expected_at: string | null
          id: string
          name: string
          phone: string | null
          property_id: string
          purpose: string | null
          status: string
          tenant_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          created_at?: string
          created_by?: string | null
          expected_at?: string | null
          id?: string
          name: string
          phone?: string | null
          property_id: string
          purpose?: string | null
          status?: string
          tenant_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          created_at?: string
          created_by?: string | null
          expected_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          property_id?: string
          purpose?: string | null
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_visitors_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_visitors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_visitors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      arthaa_washing_slots: {
        Row: {
          booked_at: string | null
          created_at: string
          id: string
          machine_id: string | null
          slot_date: string
          slot_time: string
          status: string
          tenant_id: string | null
        }
        Insert: {
          booked_at?: string | null
          created_at?: string
          id?: string
          machine_id?: string | null
          slot_date: string
          slot_time: string
          status?: string
          tenant_id?: string | null
        }
        Update: {
          booked_at?: string | null
          created_at?: string
          id?: string
          machine_id?: string | null
          slot_date?: string
          slot_time?: string
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_washing_slots_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "arthaa_laundry_machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_washing_slots_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_washing_slots_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "arthaa_v_beds"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
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
      cml_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string | null
          entity_id: string | null
          id: number
          meta: Json
          org_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: never
          meta?: Json
          org_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: never
          meta?: Json
          org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cml_audit_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_care_appointments: {
        Row: {
          created_at: string
          doctor_id: string | null
          id: string
          org_id: string
          patient_id: string
          reason: string | null
          scheduled_for: string
          slot: string | null
          status: string
          token_no: number | null
        }
        Insert: {
          created_at?: string
          doctor_id?: string | null
          id?: string
          org_id: string
          patient_id: string
          reason?: string | null
          scheduled_for?: string
          slot?: string | null
          status?: string
          token_no?: number | null
        }
        Update: {
          created_at?: string
          doctor_id?: string | null
          id?: string
          org_id?: string
          patient_id?: string
          reason?: string | null
          scheduled_for?: string
          slot?: string | null
          status?: string
          token_no?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cml_care_appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "cml_care_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_care_appointments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_care_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "cml_care_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_care_doctors: {
        Row: {
          consultation_fee_paise: number
          created_at: string
          full_name: string
          id: string
          org_id: string
          specialty: string | null
        }
        Insert: {
          consultation_fee_paise?: number
          created_at?: string
          full_name: string
          id?: string
          org_id: string
          specialty?: string | null
        }
        Update: {
          consultation_fee_paise?: number
          created_at?: string
          full_name?: string
          id?: string
          org_id?: string
          specialty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cml_care_doctors_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_care_patients: {
        Row: {
          birth_year: number | null
          created_at: string
          full_name: string
          gender: string | null
          id: string
          org_id: string
          phone: string | null
        }
        Insert: {
          birth_year?: number | null
          created_at?: string
          full_name: string
          gender?: string | null
          id?: string
          org_id: string
          phone?: string | null
        }
        Update: {
          birth_year?: number | null
          created_at?: string
          full_name?: string
          gender?: string | null
          id?: string
          org_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cml_care_patients_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_food_expenses: {
        Row: {
          amount_paise: number
          category: string
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          org_id: string
          spent_on: string
        }
        Insert: {
          amount_paise: number
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          org_id: string
          spent_on?: string
        }
        Update: {
          amount_paise?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          org_id?: string
          spent_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_food_expenses_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_food_menu_items: {
        Row: {
          category: string
          created_at: string
          id: string
          is_available: boolean
          name: string
          org_id: string
          price_paise: number
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_available?: boolean
          name: string
          org_id: string
          price_paise: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_available?: boolean
          name?: string
          org_id?: string
          price_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_food_menu_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_food_orders: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          items: Json
          order_no: number
          org_id: string
          status: string
          table_label: string | null
          total_paise: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          items: Json
          order_no?: never
          org_id: string
          status?: string
          table_label?: string | null
          total_paise: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          items?: Json
          order_no?: never
          org_id?: string
          status?: string
          table_label?: string | null
          total_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_food_orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_jewel_gold_rates: {
        Row: {
          created_at: string
          created_by: string | null
          effective_on: string
          id: string
          org_id: string
          rate_22k_paise: number
          rate_24k_paise: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          effective_on?: string
          id?: string
          org_id: string
          rate_22k_paise: number
          rate_24k_paise: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          effective_on?: string
          id?: string
          org_id?: string
          rate_22k_paise?: number
          rate_24k_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_jewel_gold_rates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_jewel_items: {
        Row: {
          category: string
          created_at: string
          id: string
          making_pct: number
          name: string
          org_id: string
          purity: string
          sku: string
          status: string
          weight_mg: number
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          making_pct?: number
          name: string
          org_id: string
          purity?: string
          sku: string
          status?: string
          weight_mg: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          making_pct?: number
          name?: string
          org_id?: string
          purity?: string
          sku?: string
          status?: string
          weight_mg?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_jewel_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_jewel_sales: {
        Row: {
          created_at: string
          created_by: string | null
          customer_name: string
          customer_phone: string | null
          gst_paise: number
          id: string
          item_id: string
          making_paise: number
          metal_paise: number
          org_id: string
          rate_paise_per_g: number
          total_paise: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_name: string
          customer_phone?: string | null
          gst_paise: number
          id?: string
          item_id: string
          making_paise: number
          metal_paise: number
          org_id: string
          rate_paise_per_g: number
          total_paise: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_name?: string
          customer_phone?: string | null
          gst_paise?: number
          id?: string
          item_id?: string
          making_paise?: number
          metal_paise?: number
          org_id?: string
          rate_paise_per_g?: number
          total_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_jewel_sales_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "cml_jewel_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_jewel_sales_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_memberships: {
        Row: {
          created_at: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_memberships_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_organizations: {
        Row: {
          business_type: string | null
          city: string | null
          created_at: string
          created_by: string
          id: string
          name: string
          phone: string | null
          slug: string
        }
        Insert: {
          business_type?: string | null
          city?: string | null
          created_at?: string
          created_by: string
          id?: string
          name: string
          phone?: string | null
          slug: string
        }
        Update: {
          business_type?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          phone?: string | null
          slug?: string
        }
        Relationships: []
      }
      cml_pawn_customers: {
        Row: {
          address: string | null
          created_at: string
          full_name: string
          id: string
          id_proof_last4: string | null
          id_proof_type: string | null
          org_id: string
          phone: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name: string
          id?: string
          id_proof_last4?: string | null
          id_proof_type?: string | null
          org_id: string
          phone: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string
          id?: string
          id_proof_last4?: string | null
          id_proof_type?: string | null
          org_id?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_pawn_customers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_pawn_pledges: {
        Row: {
          closed_on: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          due_on: string
          gross_weight_mg: number
          id: string
          interest_pct_pm: number
          item_description: string
          net_weight_mg: number
          org_id: string
          pledge_no: number
          pledged_on: string
          principal_paise: number
          purity: string
          status: string
          valuation_paise: number
        }
        Insert: {
          closed_on?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          due_on: string
          gross_weight_mg: number
          id?: string
          interest_pct_pm: number
          item_description: string
          net_weight_mg: number
          org_id: string
          pledge_no?: never
          pledged_on?: string
          principal_paise: number
          purity?: string
          status?: string
          valuation_paise: number
        }
        Update: {
          closed_on?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          due_on?: string
          gross_weight_mg?: number
          id?: string
          interest_pct_pm?: number
          item_description?: string
          net_weight_mg?: number
          org_id?: string
          pledge_no?: never
          pledged_on?: string
          principal_paise?: number
          purity?: string
          status?: string
          valuation_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_pawn_pledges_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "cml_pawn_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_pawn_pledges_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_pawn_transactions: {
        Row: {
          amount_paise: number
          created_at: string
          created_by: string | null
          id: string
          kind: string
          note: string | null
          org_id: string
          pledge_id: string
        }
        Insert: {
          amount_paise: number
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          note?: string | null
          org_id: string
          pledge_id: string
        }
        Update: {
          amount_paise?: number
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          note?: string | null
          org_id?: string
          pledge_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_pawn_transactions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_pawn_transactions_pledge_id_fkey"
            columns: ["pledge_id"]
            isOneToOne: false
            referencedRelation: "cml_pawn_pledges"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_payments: {
        Row: {
          amount_paise: number
          created_at: string
          created_by: string | null
          id: string
          method: string
          org_id: string
          provider_order_id: string | null
          provider_payment_id: string | null
          reference: string | null
          status: string
          subscription_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount_paise: number
          created_at?: string
          created_by?: string | null
          id?: string
          method: string
          org_id: string
          provider_order_id?: string | null
          provider_payment_id?: string | null
          reference?: string | null
          status?: string
          subscription_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount_paise?: number
          created_at?: string
          created_by?: string | null
          id?: string
          method?: string
          org_id?: string
          provider_order_id?: string | null
          provider_payment_id?: string | null
          reference?: string | null
          status?: string
          subscription_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cml_payments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "cml_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_plans: {
        Row: {
          annual_paise: number
          features: Json
          id: string
          is_active: boolean
          monthly_paise: number
          name: string
          product: string
          sort: number
          tagline: string | null
        }
        Insert: {
          annual_paise: number
          features?: Json
          id: string
          is_active?: boolean
          monthly_paise: number
          name: string
          product: string
          sort?: number
          tagline?: string | null
        }
        Update: {
          annual_paise?: number
          features?: Json
          id?: string
          is_active?: boolean
          monthly_paise?: number
          name?: string
          product?: string
          sort?: number
          tagline?: string | null
        }
        Relationships: []
      }
      cml_stay_complaints: {
        Row: {
          category: string
          created_at: string
          id: string
          org_id: string
          resident_id: string | null
          status: string
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          org_id: string
          resident_id?: string | null
          status?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          org_id?: string
          resident_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_stay_complaints_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_stay_complaints_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "cml_stay_residents"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_stay_rent_payments: {
        Row: {
          amount_paise: number
          created_at: string
          created_by: string | null
          for_month: string
          id: string
          method: string
          note: string | null
          org_id: string
          resident_id: string
        }
        Insert: {
          amount_paise: number
          created_at?: string
          created_by?: string | null
          for_month: string
          id?: string
          method?: string
          note?: string | null
          org_id: string
          resident_id: string
        }
        Update: {
          amount_paise?: number
          created_at?: string
          created_by?: string | null
          for_month?: string
          id?: string
          method?: string
          note?: string | null
          org_id?: string
          resident_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_stay_rent_payments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_stay_rent_payments_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "cml_stay_residents"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_stay_residents: {
        Row: {
          created_at: string
          deposit_paise: number
          full_name: string
          id: string
          monthly_rent_paise: number
          move_in: string
          move_out: string | null
          org_id: string
          phone: string | null
          room_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          deposit_paise?: number
          full_name: string
          id?: string
          monthly_rent_paise: number
          move_in?: string
          move_out?: string | null
          org_id: string
          phone?: string | null
          room_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          deposit_paise?: number
          full_name?: string
          id?: string
          monthly_rent_paise?: number
          move_in?: string
          move_out?: string | null
          org_id?: string
          phone?: string | null
          room_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_stay_residents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_stay_residents_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "cml_stay_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_stay_rooms: {
        Row: {
          created_at: string
          floor: string | null
          id: string
          name: string
          org_id: string
          rent_paise: number
          sharing: number
        }
        Insert: {
          created_at?: string
          floor?: string | null
          id?: string
          name: string
          org_id: string
          rent_paise?: number
          sharing?: number
        }
        Update: {
          created_at?: string
          floor?: string | null
          id?: string
          name?: string
          org_id?: string
          rent_paise?: number
          sharing?: number
        }
        Relationships: [
          {
            foreignKeyName: "cml_stay_rooms_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cml_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          id: string
          org_id: string
          plan_id: string
          product: string
          status: string
          updated_at: string
        }
        Insert: {
          billing_cycle: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          org_id: string
          plan_id: string
          product: string
          status?: string
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          org_id?: string
          plan_id?: string
          product?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cml_subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "cml_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "cml_plans"
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
      dsim_admin_emails: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      dsim_chit_groups: {
        Row: {
          commission_pct: number
          created_at: string
          id: string
          max_bid_pct: number
          members_count: number
          monthly_amount: number
          name: string
          start_date: string
          status: string
        }
        Insert: {
          commission_pct?: number
          created_at?: string
          id?: string
          max_bid_pct?: number
          members_count: number
          monthly_amount: number
          name: string
          start_date?: string
          status?: string
        }
        Update: {
          commission_pct?: number
          created_at?: string
          id?: string
          max_bid_pct?: number
          members_count?: number
          monthly_amount?: number
          name?: string
          start_date?: string
          status?: string
        }
        Relationships: []
      }
      dsim_chit_members: {
        Row: {
          group_id: string
          id: string
          ticket_no: number
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          ticket_no: number
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          ticket_no?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dsim_chit_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dsim_chit_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_chit_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_chit_payments: {
        Row: {
          amount: number
          created_at: string
          group_id: string
          id: string
          method: string
          note: string | null
          payment_date: string
          payment_reference: string | null
          payment_status: string
          round_id: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          group_id: string
          id?: string
          method?: string
          note?: string | null
          payment_date?: string
          payment_reference?: string | null
          payment_status?: string
          round_id: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          group_id?: string
          id?: string
          method?: string
          note?: string | null
          payment_date?: string
          payment_reference?: string | null
          payment_status?: string
          round_id?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dsim_chit_payments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dsim_chit_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_chit_payments_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "dsim_chit_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_chit_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_chit_payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_chit_rounds: {
        Row: {
          auction_date: string
          bid_discount: number
          commission: number
          created_at: string
          disbursed_at: string | null
          dividend: number
          group_id: string
          id: string
          installment: number
          payout: number
          round_no: number
          second_approved_at: string | null
          second_approved_by: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          auction_date: string
          bid_discount?: number
          commission?: number
          created_at?: string
          disbursed_at?: string | null
          dividend?: number
          group_id: string
          id?: string
          installment: number
          payout?: number
          round_no: number
          second_approved_at?: string | null
          second_approved_by?: string | null
          status?: string
          winner_id?: string | null
        }
        Update: {
          auction_date?: string
          bid_discount?: number
          commission?: number
          created_at?: string
          disbursed_at?: string | null
          dividend?: number
          group_id?: string
          id?: string
          installment?: number
          payout?: number
          round_no?: number
          second_approved_at?: string | null
          second_approved_by?: string | null
          status?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dsim_chit_rounds_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dsim_chit_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_chit_rounds_second_approved_by_fkey"
            columns: ["second_approved_by"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_chit_rounds_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_investments: {
        Row: {
          amount: number
          created_at: string
          frequency: string
          id: string
          method: string
          note: string | null
          payment_date: string
          payment_reference: string | null
          payment_status: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          frequency?: string
          id?: string
          method?: string
          note?: string | null
          payment_date?: string
          payment_reference?: string | null
          payment_status?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          frequency?: string
          id?: string
          method?: string
          note?: string | null
          payment_date?: string
          payment_reference?: string | null
          payment_status?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dsim_investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_investments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_kyc_documents: {
        Row: {
          created_at: string
          doc_type: string
          file_path: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          file_path: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          file_path?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dsim_kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_loan_requests: {
        Row: {
          admin_note: string | null
          approved_amount: number | null
          approved_tenure: number | null
          borrower_id: string
          created_at: string
          id: string
          interest_rate: number | null
          loan_type: string
          purpose: string
          request_date: string
          requested_amount: number
          reviewed_at: string | null
          reviewed_by: string | null
          second_approved_at: string | null
          second_approved_by: string | null
          status: string
          tenure_weeks: number
        }
        Insert: {
          admin_note?: string | null
          approved_amount?: number | null
          approved_tenure?: number | null
          borrower_id: string
          created_at?: string
          id?: string
          interest_rate?: number | null
          loan_type?: string
          purpose: string
          request_date?: string
          requested_amount: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          second_approved_at?: string | null
          second_approved_by?: string | null
          status?: string
          tenure_weeks: number
        }
        Update: {
          admin_note?: string | null
          approved_amount?: number | null
          approved_tenure?: number | null
          borrower_id?: string
          created_at?: string
          id?: string
          interest_rate?: number | null
          loan_type?: string
          purpose?: string
          request_date?: string
          requested_amount?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          second_approved_at?: string | null
          second_approved_by?: string | null
          status?: string
          tenure_weeks?: number
        }
        Relationships: [
          {
            foreignKeyName: "dsim_loan_requests_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_loan_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_loan_requests_second_approved_by_fkey"
            columns: ["second_approved_by"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_loans: {
        Row: {
          balance_remaining: number
          borrower_id: string
          created_at: string
          ever_overdue: boolean
          id: string
          installment_amount: number
          installments_paid: number
          interest_rate: number
          loan_request_id: string | null
          loan_type: string
          next_due_date: string | null
          principal_amount: number
          repayment_status: string
          start_date: string
          tenure_weeks: number
          total_repayable: number
        }
        Insert: {
          balance_remaining: number
          borrower_id: string
          created_at?: string
          ever_overdue?: boolean
          id?: string
          installment_amount: number
          installments_paid?: number
          interest_rate: number
          loan_request_id?: string | null
          loan_type?: string
          next_due_date?: string | null
          principal_amount: number
          repayment_status?: string
          start_date: string
          tenure_weeks: number
          total_repayable: number
        }
        Update: {
          balance_remaining?: number
          borrower_id?: string
          created_at?: string
          ever_overdue?: boolean
          id?: string
          installment_amount?: number
          installments_paid?: number
          interest_rate?: number
          loan_request_id?: string | null
          loan_type?: string
          next_due_date?: string | null
          principal_amount?: number
          repayment_status?: string
          start_date?: string
          tenure_weeks?: number
          total_repayable?: number
        }
        Relationships: [
          {
            foreignKeyName: "dsim_loans_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_loans_loan_request_id_fkey"
            columns: ["loan_request_id"]
            isOneToOne: true
            referencedRelation: "dsim_loan_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_login_attempts: {
        Row: {
          created_at: string
          device_id: string | null
          id: number
          ok: boolean
          phone: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: number
          ok: boolean
          phone?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: number
          ok?: boolean
          phone?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dsim_login_codes: {
        Row: {
          code_hash: string
          created_at: string
          expires_at: string
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string
          expires_at: string
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string
          expires_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dsim_login_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dsim_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_profiles: {
        Row: {
          approved: boolean
          created_at: string
          device_bound_at: string | null
          device_id: string | null
          email: string | null
          id: string
          is_approver: boolean
          kyc_status: string
          last_login_at: string | null
          limit_adjust: number
          loan_limit: number | null
          name: string
          phone: string | null
          pin_set: boolean
          reminders_enabled: boolean
          removed: boolean
          role: string
          weekly_amount: number
        }
        Insert: {
          approved?: boolean
          created_at?: string
          device_bound_at?: string | null
          device_id?: string | null
          email?: string | null
          id: string
          is_approver?: boolean
          kyc_status?: string
          last_login_at?: string | null
          limit_adjust?: number
          loan_limit?: number | null
          name: string
          phone?: string | null
          pin_set?: boolean
          reminders_enabled?: boolean
          removed?: boolean
          role?: string
          weekly_amount?: number
        }
        Update: {
          approved?: boolean
          created_at?: string
          device_bound_at?: string | null
          device_id?: string | null
          email?: string | null
          id?: string
          is_approver?: boolean
          kyc_status?: string
          last_login_at?: string | null
          limit_adjust?: number
          loan_limit?: number | null
          name?: string
          phone?: string | null
          pin_set?: boolean
          reminders_enabled?: boolean
          removed?: boolean
          role?: string
          weekly_amount?: number
        }
        Relationships: []
      }
      dsim_repayments: {
        Row: {
          amount: number
          borrower_id: string
          created_at: string
          id: string
          loan_id: string
          method: string
          note: string | null
          payment_date: string
          payment_reference: string | null
          payment_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          borrower_id: string
          created_at?: string
          id?: string
          loan_id: string
          method?: string
          note?: string | null
          payment_date?: string
          payment_reference?: string | null
          payment_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          borrower_id?: string
          created_at?: string
          id?: string
          loan_id?: string
          method?: string
          note?: string | null
          payment_date?: string
          payment_reference?: string | null
          payment_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dsim_repayments_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_repayments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "dsim_loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dsim_repayments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "dsim_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dsim_settings: {
        Row: {
          base_limit_pct: number
          default_interest_rate: number
          emergency_max: number
          emergency_rate: number
          id: number
          limit_step_pct: number
          loan_multiplier: number
          max_limit_pct: number
          min_balance: number
          payee_name: string
          payee_vpa: string
          second_approval: boolean
          updated_at: string
        }
        Insert: {
          base_limit_pct?: number
          default_interest_rate?: number
          emergency_max?: number
          emergency_rate?: number
          id?: number
          limit_step_pct?: number
          loan_multiplier?: number
          max_limit_pct?: number
          min_balance?: number
          payee_name?: string
          payee_vpa?: string
          second_approval?: boolean
          updated_at?: string
        }
        Update: {
          base_limit_pct?: number
          default_interest_rate?: number
          emergency_max?: number
          emergency_rate?: number
          id?: number
          limit_step_pct?: number
          loan_multiplier?: number
          max_limit_pct?: number
          min_balance?: number
          payee_name?: string
          payee_vpa?: string
          second_approval?: boolean
          updated_at?: string
        }
        Relationships: []
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
      learn_activity: {
        Row: {
          created_at: string
          id: number
          kind: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          kind: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          kind?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_ai_config: {
        Row: {
          feature: string
          is_active: boolean
          max_output_tokens: number
          model: string
          provider: string
          temperature: number
          updated_at: string
        }
        Insert: {
          feature: string
          is_active?: boolean
          max_output_tokens?: number
          model: string
          provider: string
          temperature?: number
          updated_at?: string
        }
        Update: {
          feature?: string
          is_active?: boolean
          max_output_tokens?: number
          model?: string
          provider?: string
          temperature?: number
          updated_at?: string
        }
        Relationships: []
      }
      learn_ai_usage: {
        Row: {
          created_at: string
          feature: string
          id: number
          input_tokens: number
          model: string
          output_tokens: number
          provider: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature: string
          id?: never
          input_tokens?: number
          model: string
          output_tokens?: number
          provider: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature?: string
          id?: never
          input_tokens?: number
          model?: string
          output_tokens?: number
          provider?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: number
          meta: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: never
          meta?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: never
          meta?: Json | null
        }
        Relationships: []
      }
      learn_certifications: {
        Row: {
          created_at: string
          id: string
          issued_on: string | null
          issuer: string | null
          name: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issued_on?: string | null
          issuer?: string | null
          name: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issued_on?: string | null
          issuer?: string | null
          name?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      learn_conversations: {
        Row: {
          created_at: string
          id: string
          is_saved: boolean
          mode: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_saved?: boolean
          mode?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_saved?: boolean
          mode?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_countries: {
        Row: {
          code: string
          currency_code: string
          default_locale: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          currency_code: string
          default_locale?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          currency_code?: string
          default_locale?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_countries_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "learn_currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      learn_coupons: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          max_redemptions: number | null
          percent_off: number
          redeemed_count: number
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          max_redemptions?: number | null
          percent_off: number
          redeemed_count?: number
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          max_redemptions?: number | null
          percent_off?: number
          redeemed_count?: number
          valid_until?: string | null
        }
        Relationships: []
      }
      learn_currencies: {
        Row: {
          code: string
          is_active: boolean
          minor_units: number
          name: string
          symbol: string
        }
        Insert: {
          code: string
          is_active?: boolean
          minor_units?: number
          name: string
          symbol: string
        }
        Update: {
          code?: string
          is_active?: boolean
          minor_units?: number
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      learn_education: {
        Row: {
          created_at: string
          end_year: number | null
          field: string | null
          grade: string | null
          id: string
          institution: string
          qualification: string
          start_year: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          end_year?: number | null
          field?: string | null
          grade?: string | null
          id?: string
          institution: string
          qualification: string
          start_year?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          end_year?: number | null
          field?: string | null
          grade?: string | null
          id?: string
          institution?: string
          qualification?: string
          start_year?: number | null
          user_id?: string
        }
        Relationships: []
      }
      learn_exam_questions: {
        Row: {
          answer_index: number
          created_at: string
          difficulty: number
          exam_slug: string
          explanation: string | null
          id: string
          options: Json
          prompt: string
          subject: string
          topic: string
        }
        Insert: {
          answer_index: number
          created_at?: string
          difficulty?: number
          exam_slug: string
          explanation?: string | null
          id?: string
          options: Json
          prompt: string
          subject: string
          topic: string
        }
        Update: {
          answer_index?: number
          created_at?: string
          difficulty?: number
          exam_slug?: string
          explanation?: string | null
          id?: string
          options?: Json
          prompt?: string
          subject?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_exam_questions_exam_slug_fkey"
            columns: ["exam_slug"]
            isOneToOne: false
            referencedRelation: "learn_exams"
            referencedColumns: ["slug"]
          },
        ]
      }
      learn_exams: {
        Row: {
          country_code: string | null
          description: string | null
          is_active: boolean
          name: string
          slug: string
          subjects: string[]
        }
        Insert: {
          country_code?: string | null
          description?: string | null
          is_active?: boolean
          name: string
          slug: string
          subjects?: string[]
        }
        Update: {
          country_code?: string | null
          description?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          subjects?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "learn_exams_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "learn_countries"
            referencedColumns: ["code"]
          },
        ]
      }
      learn_experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_feature_flags: {
        Row: {
          description: string | null
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      learn_founder_workspaces: {
        Row: {
          created_at: string
          id: string
          stages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stages?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_interviews: {
        Row: {
          completed_at: string | null
          created_at: string
          feedback: Json | null
          id: string
          mode: string
          status: string
          target_role: string | null
          transcript: Json
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          feedback?: Json | null
          id?: string
          mode: string
          status?: string
          target_role?: string | null
          transcript?: Json
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          feedback?: Json | null
          id?: string
          mode?: string
          status?: string
          target_role?: string | null
          transcript?: Json
          user_id?: string
        }
        Relationships: []
      }
      learn_job_analyses: {
        Row: {
          company: string | null
          created_at: string
          id: string
          jd_text: string
          report: Json | null
          title: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          id?: string
          jd_text: string
          report?: Json | null
          title?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          id?: string
          jd_text?: string
          report?: Json | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      learn_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          feedback: number | null
          id: string
          model: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          feedback?: number | null
          id?: string
          model?: string | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          feedback?: number | null
          id?: string
          model?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "learn_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_notification_prefs: {
        Row: {
          billing: boolean
          interview_reminders: boolean
          project_milestones: boolean
          streaks: boolean
          study_reminders: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          billing?: boolean
          interview_reminders?: boolean
          project_milestones?: boolean
          streaks?: boolean
          study_reminders?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          billing?: boolean
          interview_reminders?: boolean
          project_milestones?: boolean
          streaks?: boolean
          study_reminders?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_notifications: {
        Row: {
          body: string | null
          created_at: string
          href: string | null
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_payments: {
        Row: {
          amount_minor: number
          created_at: string
          currency_code: string
          id: string
          provider: string
          provider_ref: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency_code: string
          id?: string
          provider?: string
          provider_ref?: string | null
          status?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency_code?: string
          id?: string
          provider?: string
          provider_ref?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_payments_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "learn_currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "learn_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "learn_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_plan_prices: {
        Row: {
          amount_minor: number
          billing_interval: string
          currency_code: string
          plan_id: string
        }
        Insert: {
          amount_minor: number
          billing_interval: string
          currency_code: string
          plan_id: string
        }
        Update: {
          amount_minor?: number
          billing_interval?: string
          currency_code?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_plan_prices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "learn_currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "learn_plan_prices_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "learn_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_plans: {
        Row: {
          ai_messages_per_day: number
          features: Json
          id: string
          is_active: boolean
          name: string
          sort: number
          tagline: string | null
          tier: number
          trial_days: number
          updated_at: string
        }
        Insert: {
          ai_messages_per_day?: number
          features?: Json
          id: string
          is_active?: boolean
          name: string
          sort?: number
          tagline?: string | null
          tier?: number
          trial_days?: number
          updated_at?: string
        }
        Update: {
          ai_messages_per_day?: number
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          sort?: number
          tagline?: string | null
          tier?: number
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      learn_profiles: {
        Row: {
          age_band: string | null
          career_goals: string | null
          country_code: string | null
          created_at: string
          current_education: string | null
          display_name: string | null
          exam_goals: string[]
          generated_profile: Json | null
          interests: string[]
          learning_prefs: Json
          locale: string
          onboarding_completed_at: string | null
          skills: string[]
          stage: string | null
          subjects: string[]
          target_country: string | null
          target_role: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_band?: string | null
          career_goals?: string | null
          country_code?: string | null
          created_at?: string
          current_education?: string | null
          display_name?: string | null
          exam_goals?: string[]
          generated_profile?: Json | null
          interests?: string[]
          learning_prefs?: Json
          locale?: string
          onboarding_completed_at?: string | null
          skills?: string[]
          stage?: string | null
          subjects?: string[]
          target_country?: string | null
          target_role?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_band?: string | null
          career_goals?: string | null
          country_code?: string | null
          created_at?: string
          current_education?: string | null
          display_name?: string | null
          exam_goals?: string[]
          generated_profile?: Json | null
          interests?: string[]
          learning_prefs?: Json
          locale?: string
          onboarding_completed_at?: string | null
          skills?: string[]
          stage?: string | null
          subjects?: string[]
          target_country?: string | null
          target_role?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_profiles_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "learn_countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "learn_profiles_target_country_fkey"
            columns: ["target_country"]
            isOneToOne: false
            referencedRelation: "learn_countries"
            referencedColumns: ["code"]
          },
        ]
      }
      learn_project_tasks: {
        Row: {
          id: string
          is_done: boolean
          milestone: string | null
          project_id: string
          sort: number
          title: string
          user_id: string
        }
        Insert: {
          id?: string
          is_done?: boolean
          milestone?: string | null
          project_id: string
          sort?: number
          title: string
          user_id: string
        }
        Update: {
          id?: string
          is_done?: boolean
          milestone?: string | null
          project_id?: string
          sort?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "learn_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_projects: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          level: string
          live_url: string | null
          repo_url: string | null
          spec: Json
          status: string
          target_role: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          level: string
          live_url?: string | null
          repo_url?: string | null
          spec?: Json
          status?: string
          target_role?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          level?: string
          live_url?: string | null
          repo_url?: string | null
          spec?: Json
          status?: string
          target_role?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_prompts: {
        Row: {
          key: string
          system_prompt: string
          updated_at: string
          version: number
        }
        Insert: {
          key: string
          system_prompt: string
          updated_at?: string
          version?: number
        }
        Update: {
          key?: string
          system_prompt?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      learn_push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          keys: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          keys: Json
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          keys?: Json
          user_id?: string
        }
        Relationships: []
      }
      learn_quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string
          exam_slug: string | null
          id: string
          questions: Json
          score: number | null
          subject: string
          topic: string
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          exam_slug?: string | null
          id?: string
          questions: Json
          score?: number | null
          subject: string
          topic: string
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          exam_slug?: string | null
          id?: string
          questions?: Json
          score?: number | null
          subject?: string
          topic?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      learn_resume_versions: {
        Row: {
          created_at: string
          data: Json
          id: string
          note: string | null
          resume_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          note?: string | null
          resume_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          note?: string | null
          resume_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_resume_versions_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "learn_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_resumes: {
        Row: {
          created_at: string
          data: Json
          id: string
          template: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          template?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          template?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_skill_progress: {
        Row: {
          roadmap_slug: string
          status: string
          step_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          roadmap_slug: string
          status?: string
          step_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          roadmap_slug?: string
          status?: string
          step_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learn_subscriptions: {
        Row: {
          billing_interval: string
          coupon_code: string | null
          created_at: string
          currency_code: string
          current_period_end: string | null
          id: string
          plan_id: string
          status: string
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_interval?: string
          coupon_code?: string | null
          created_at?: string
          currency_code: string
          current_period_end?: string | null
          id?: string
          plan_id: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_interval?: string
          coupon_code?: string | null
          created_at?: string
          currency_code?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_subscriptions_coupon_code_fkey"
            columns: ["coupon_code"]
            isOneToOne: false
            referencedRelation: "learn_coupons"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "learn_subscriptions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "learn_currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "learn_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "learn_plans"
            referencedColumns: ["id"]
          },
        ]
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
      arthaa_v_beds: {
        Row: {
          bed_id: string | null
          bed_label: string | null
          bed_status: string | null
          building_id: string | null
          floor: number | null
          is_occupied: boolean | null
          monthly_rent: number | null
          property_id: string | null
          room_id: string | null
          room_number: string | null
          room_status: string | null
          sharing_type: string | null
          tenant_id: string | null
          tenant_name: string | null
          tenant_rent: number | null
          tenant_status: string | null
          total_beds: number | null
        }
        Relationships: [
          {
            foreignKeyName: "arthaa_rooms_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "arthaa_buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arthaa_rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "arthaa_properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      arthaa_attention_required: {
        Args: { p_property?: string }
        Returns: Json
      }
      arthaa_attention_required_base: {
        Args: { p_property?: string }
        Returns: Json
      }
      arthaa_book: {
        Args: {
          p_date: string
          p_purpose?: string
          p_resource: string
          p_slots?: number
          p_start_min: number
          p_tenant?: string
        }
        Returns: Json
      }
      arthaa_book_slot: { Args: { p_slot: string }; Returns: Json }
      arthaa_booking_board: {
        Args: {
          p_days?: number
          p_from?: string
          p_kind: string
          p_property?: string
        }
        Returns: Json
      }
      arthaa_booking_stats: {
        Args: {
          p_from?: string
          p_kind: string
          p_property?: string
          p_to?: string
        }
        Returns: Json
      }
      arthaa_branch_comparison: {
        Args: { p_from?: string; p_to?: string }
        Returns: Json
      }
      arthaa_can_see_ticket: {
        Args: {
          p_ticket: Database["public"]["Tables"]["arthaa_support_tickets"]["Row"]
        }
        Returns: boolean
      }
      arthaa_cancel_booking: { Args: { p_booking: string }; Returns: Json }
      arthaa_cancel_slot: { Args: { p_slot: string }; Returns: undefined }
      arthaa_claim_account: { Args: never; Returns: Json }
      arthaa_dept_label: { Args: { p: string }; Returns: string }
      arthaa_is_ops: { Args: never; Returns: boolean }
      arthaa_is_owner: { Args: never; Returns: boolean }
      arthaa_is_staff: { Args: never; Returns: boolean }
      arthaa_issue_access_code: {
        Args: {
          p_credential?: string
          p_holder_type: string
          p_label: string
          p_property: string
          p_staff: string
          p_tenant: string
          p_valid_to?: string
          p_visitor: string
        }
        Returns: Json
      }
      arthaa_laundry_stats: {
        Args: { p_from?: string; p_property?: string; p_to?: string }
        Returns: Json
      }
      arthaa_log: {
        Args: {
          p_action: string
          p_entity: string
          p_entity_id: string
          p_meta?: Json
          p_property: string
          p_summary: string
        }
        Returns: undefined
      }
      arthaa_min_label: { Args: { m: number }; Returns: string }
      arthaa_my_role: { Args: never; Returns: string }
      arthaa_my_staff_id: { Args: never; Returns: string }
      arthaa_my_staff_property: { Args: never; Returns: string }
      arthaa_my_tenant_id: { Args: never; Returns: string }
      arthaa_new_resident_analytics: {
        Args: { p_months?: number; p_property?: string }
        Returns: Json
      }
      arthaa_occupancy: { Args: { p_property?: string }; Returns: Json }
      arthaa_owner_dashboard: {
        Args: { p_from?: string; p_property?: string; p_to?: string }
        Returns: Json
      }
      arthaa_owner_search: { Args: { q: string }; Returns: Json }
      arthaa_pending_payment_proofs: {
        Args: { p_property?: string }
        Returns: number
      }
      arthaa_push_dispatch: {
        Args: {
          p_body: string
          p_profiles: string[]
          p_tag: string
          p_title: string
          p_url: string
        }
        Returns: undefined
      }
      arthaa_push_prune: {
        Args: { p_endpoints: string[]; p_secret: string }
        Returns: number
      }
      arthaa_push_subscribe: {
        Args: {
          p_auth: string
          p_endpoint: string
          p_p256dh: string
          p_ua?: string
        }
        Returns: undefined
      }
      arthaa_push_unsubscribe: {
        Args: { p_endpoint: string }
        Returns: undefined
      }
      arthaa_raise_alert: {
        Args: {
          p_body: string
          p_category: string
          p_department: string
          p_priority: string
          p_property: string
          p_source_id: string
          p_source_table: string
          p_title: string
        }
        Returns: string
      }
      arthaa_resident_context: { Args: never; Returns: Json }
      arthaa_review_payment_proof: {
        Args: { p_approve: boolean; p_note?: string; p_submission: string }
        Returns: Json
      }
      arthaa_run_rent_reminders: { Args: never; Returns: Json }
      arthaa_submit_notice: {
        Args: { p_move_out: string; p_reason?: string }
        Returns: Json
      }
      arthaa_submit_payment_proof: {
        Args: {
          p_amount: number
          p_paid_on?: string
          p_payment: string
          p_screenshot: string
          p_utr: string
        }
        Returns: Json
      }
      arthaa_support_create_ticket: {
        Args: {
          p_category?: string
          p_conversation?: string
          p_department: string
          p_description?: string
          p_meal_type?: string
          p_photo_url?: string
          p_priority?: string
          p_source?: string
          p_title: string
        }
        Returns: Json
      }
      arthaa_support_insights: {
        Args: { p_from?: string; p_property?: string; p_to?: string }
        Returns: Json
      }
      arthaa_support_post_assistant: {
        Args: { p_body: string; p_conversation: string; p_payload?: Json }
        Returns: string
      }
      arthaa_support_post_assistant_self: {
        Args: { p_body: string; p_conversation: string; p_payload?: Json }
        Returns: string
      }
      arthaa_support_set_status: {
        Args: {
          p_assign_staff?: string
          p_note?: string
          p_status: string
          p_ticket: string
        }
        Returns: Json
      }
      arthaa_time_min: { Args: { t: string }; Returns: number }
      cml_add_member: {
        Args: { p_email: string; p_org: string; p_role: string }
        Returns: undefined
      }
      cml_admin_review_payment: {
        Args: { p_approve: boolean; p_payment: string }
        Returns: undefined
      }
      cml_create_organization: {
        Args: {
          p_business_type: string
          p_city: string
          p_name: string
          p_phone: string
        }
        Returns: {
          business_type: string | null
          city: string | null
          created_at: string
          created_by: string
          id: string
          name: string
          phone: string | null
          slug: string
        }
        SetofOptions: {
          from: "*"
          to: "cml_organizations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cml_has_access: {
        Args: { p_org: string; p_product: string }
        Returns: boolean
      }
      cml_is_member: { Args: { p_org: string }; Returns: boolean }
      cml_jewel_record_sale: {
        Args: { p_customer: string; p_item: string; p_phone: string }
        Returns: {
          created_at: string
          created_by: string | null
          customer_name: string
          customer_phone: string | null
          gst_paise: number
          id: string
          item_id: string
          making_paise: number
          metal_paise: number
          org_id: string
          rate_paise_per_g: number
          total_paise: number
        }
        SetofOptions: {
          from: "*"
          to: "cml_jewel_sales"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cml_log: {
        Args: {
          p_action: string
          p_entity: string
          p_entity_id: string
          p_meta?: Json
          p_org: string
        }
        Returns: undefined
      }
      cml_member_role: { Args: { p_org: string }; Returns: string }
      cml_org_members: {
        Args: { p_org: string }
        Returns: {
          email: string
          full_name: string
          joined_at: string
          role: string
          user_id: string
        }[]
      }
      cml_pawn_close_pledge: {
        Args: {
          p_amount_paise: number
          p_kind: string
          p_note: string
          p_pledge: string
        }
        Returns: undefined
      }
      cml_start_subscription: {
        Args: { p_cycle: string; p_org: string; p_plan: string }
        Returns: {
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          id: string
          org_id: string
          plan_id: string
          product: string
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "cml_subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cml_submit_manual_payment: {
        Args: { p_method: string; p_reference: string; p_subscription: string }
        Returns: string
      }
      current_client_id: { Args: never; Returns: string }
      dsim_admin_add_cash_chit_payment: {
        Args: {
          p_amount: number
          p_date: string
          p_note: string
          p_round: string
          p_user: string
        }
        Returns: undefined
      }
      dsim_admin_add_cash_investment: {
        Args: {
          p_amount: number
          p_date: string
          p_note: string
          p_user: string
        }
        Returns: undefined
      }
      dsim_admin_add_cash_repayment: {
        Args: {
          p_amount: number
          p_date: string
          p_loan: string
          p_note: string
        }
        Returns: undefined
      }
      dsim_admin_approve_request: {
        Args: {
          p_amount: number
          p_id: string
          p_note: string
          p_rate: number
          p_tenure: number
        }
        Returns: undefined
      }
      dsim_admin_bootstrap: {
        Args: never
        Returns: {
          approved: boolean
          created_at: string
          device_bound_at: string | null
          device_id: string | null
          email: string | null
          id: string
          is_approver: boolean
          kyc_status: string
          last_login_at: string | null
          limit_adjust: number
          loan_limit: number | null
          name: string
          phone: string | null
          pin_set: boolean
          reminders_enabled: boolean
          removed: boolean
          role: string
          weekly_amount: number
        }
        SetofOptions: {
          from: "*"
          to: "dsim_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      dsim_admin_chit_award: {
        Args: { p_discount: number; p_round: string; p_winner: string }
        Returns: undefined
      }
      dsim_admin_chit_disburse: {
        Args: { p_round: string }
        Returns: undefined
      }
      dsim_admin_chit_reopen: { Args: { p_round: string }; Returns: undefined }
      dsim_admin_create_chit: {
        Args: {
          p_commission: number
          p_members: string[]
          p_monthly: number
          p_name: string
          p_start: string
        }
        Returns: string
      }
      dsim_admin_disburse: {
        Args: { p_id: string; p_start: string }
        Returns: string
      }
      dsim_admin_issue_login_code: { Args: { p_user: string }; Returns: string }
      dsim_admin_review_request: {
        Args: { p_action: string; p_id: string; p_note: string }
        Returns: undefined
      }
      dsim_admin_set_member: {
        Args: {
          p_approved?: boolean
          p_approver?: boolean
          p_clear_limit?: boolean
          p_kyc?: string
          p_limit?: number
          p_limit_adjust?: number
          p_name?: string
          p_phone?: string
          p_reminders?: boolean
          p_role?: string
          p_user: string
          p_weekly?: number
        }
        Returns: undefined
      }
      dsim_admin_update_loan_rate: {
        Args: { p_loan: string; p_rate: number }
        Returns: undefined
      }
      dsim_admin_update_settings: {
        Args: {
          p_base_pct?: number
          p_emergency_max?: number
          p_emergency_rate?: number
          p_max_pct?: number
          p_min_balance?: number
          p_name: string
          p_rate: number
          p_second_approval?: boolean
          p_step_pct?: number
          p_vpa: string
        }
        Returns: undefined
      }
      dsim_admin_verify_chit_payment: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      dsim_admin_verify_investment: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      dsim_admin_verify_repayment: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      dsim_apply_repayment: {
        Args: { p_amount: number; p_loan: string }
        Returns: undefined
      }
      dsim_approver_queue: { Args: never; Returns: Json }
      dsim_check_login_code: {
        Args: { p_code: string; p_user: string }
        Returns: boolean
      }
      dsim_chit_second_approve: {
        Args: { p_note: string; p_ok: boolean; p_round: string }
        Returns: undefined
      }
      dsim_fund_cash: { Args: never; Returns: number }
      dsim_fund_summary: { Args: never; Returns: Json }
      dsim_is_admin: { Args: never; Returns: boolean }
      dsim_is_approver: { Args: never; Returns: boolean }
      dsim_is_member: { Args: never; Returns: boolean }
      dsim_issue_login_code_internal: {
        Args: { p_user: string }
        Returns: string
      }
      dsim_limit_info: { Args: { p_user: string }; Returns: Json }
      dsim_limit_info_internal: { Args: { p_user: string }; Returns: Json }
      dsim_loan_limit: { Args: { p_user: string }; Returns: number }
      dsim_mark_notifications_read: { Args: never; Returns: undefined }
      dsim_my_chits: { Args: never; Returns: Json }
      dsim_notify: {
        Args: {
          p_body: string
          p_kind: string
          p_title: string
          p_user: string
        }
        Returns: undefined
      }
      dsim_refresh_overdue: { Args: never; Returns: undefined }
      dsim_register: {
        Args: { p_name: string; p_phone: string; p_role: string }
        Returns: {
          approved: boolean
          created_at: string
          device_bound_at: string | null
          device_id: string | null
          email: string | null
          id: string
          is_approver: boolean
          kyc_status: string
          last_login_at: string | null
          limit_adjust: number
          loan_limit: number | null
          name: string
          phone: string | null
          pin_set: boolean
          reminders_enabled: boolean
          removed: boolean
          role: string
          weekly_amount: number
        }
        SetofOptions: {
          from: "*"
          to: "dsim_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      dsim_require_admin: { Args: never; Returns: undefined }
      dsim_second_approve: {
        Args: { p_id: string; p_note: string; p_ok: boolean }
        Returns: undefined
      }
      dsim_submit_kyc: { Args: never; Returns: undefined }
      dsim_update_my_profile: {
        Args: { p_name: string; p_phone: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      learn_ai_calls_today: { Args: never; Returns: number }
      learn_cancel_subscription: { Args: { p_id: string }; Returns: undefined }
      learn_check_coupon: { Args: { p_code: string }; Returns: number }
      learn_request_plan: {
        Args: {
          p_coupon?: string
          p_currency: string
          p_interval: string
          p_plan: string
        }
        Returns: string
      }
      learn_start_trial: {
        Args: { p_currency: string; p_plan: string }
        Returns: string
      }
      submit_project_request: {
        Args: {
          p_budget_range: string
          p_build_type: string
          p_contact_email: string
          p_contact_name: string
          p_contact_phone: string
          p_idea_description: string
          p_industry: string
          p_timeline: string
          p_wants_consultation: boolean
        }
        Returns: string
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
