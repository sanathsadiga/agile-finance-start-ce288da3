
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          company_name: string | null
          email: string
          avatar_url: string | null
          email_confirmed: boolean
          // Business details
          business_phone: string | null
          business_website: string | null
          business_address: string | null
          business_city: string | null
          business_state: string | null
          business_postal_code: string | null
          business_country: string | null
          default_currency: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          company_name?: string | null
          email: string
          avatar_url?: string | null
          email_confirmed?: boolean
          business_phone?: string | null
          business_website?: string | null
          business_address?: string | null
          business_city?: string | null
          business_state?: string | null
          business_postal_code?: string | null
          business_country?: string | null
          default_currency?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          company_name?: string | null
          email?: string
          avatar_url?: string | null
          email_confirmed?: boolean
          business_phone?: string | null
          business_website?: string | null
          business_address?: string | null
          business_city?: string | null
          business_state?: string | null
          business_postal_code?: string | null
          business_country?: string | null
          default_currency?: string | null
        }
      }
      invoice_templates: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          name: string
          is_default: boolean
          layout_config: Json
          style_config: Json
          content_config: Json
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          name: string
          is_default?: boolean
          layout_config?: Json
          style_config?: Json
          content_config?: Json
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          name?: string
          is_default?: boolean
          layout_config?: Json
          style_config?: Json
          content_config?: Json
        }
      }
      invoice_settings: {
        Row: {
          id: string
          user_id: string
          user_email: string | null
          user_name: string | null
          created_at: string
          updated_at: string
          invoice_prefix: string
          next_invoice_number: number
          default_payment_terms: number
          auto_reminders: boolean
          logo_url: string | null
          notes_default: string | null
          terms_default: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_email?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
          invoice_prefix?: string
          next_invoice_number?: number
          default_payment_terms?: number
          auto_reminders?: boolean
          logo_url?: string | null
          notes_default?: string | null
          terms_default?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_email?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
          invoice_prefix?: string
          next_invoice_number?: number
          default_payment_terms?: number
          auto_reminders?: boolean
          logo_url?: string | null
          notes_default?: string | null
          terms_default?: string | null
        }
      }
      tax_settings: {
        Row: {
          id: string
          user_id: string
          user_email: string | null
          user_name: string | null
          created_at: string
          updated_at: string
          tax_enabled: boolean
          default_tax_rate: number
          tax_name: string
          tax_registration_number: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_email?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
          tax_enabled?: boolean
          default_tax_rate?: number
          tax_name?: string
          tax_registration_number?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_email?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
          tax_enabled?: boolean
          default_tax_rate?: number
          tax_name?: string
          tax_registration_number?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          invoice_number: string
          invoice_template_id: string | null
          customer: string | null
          email: string | null
          date: string
          due_date: string | null
          amount: number
          status: string
          description: string | null
          notes: string | null
          items: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_number: string
          invoice_template_id?: string | null
          customer?: string | null
          email?: string | null
          date: string
          due_date?: string | null
          amount: number
          status: string
          description?: string | null
          notes?: string | null
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_number?: string
          invoice_template_id?: string | null
          customer?: string | null
          email?: string | null
          date?: string
          due_date?: string | null
          amount?: number
          status?: string
          description?: string | null
          notes?: string | null
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          user_email: string | null
          user_name: string | null
          created_at: string
          updated_at: string
          date: string
          amount: number
          category: string
          payment_method: string
          description: string
          vendor: string | null
          receipt: boolean
          receipt_url: string | null
          notes: string | null
          is_recurring: boolean
          recurrence_frequency: string | null
          recurrence_interval: number | null
          recurrence_end_date: string | null
          currency: string
        }
        Insert: {
          id?: string
          user_id: string
          user_email?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
          date: string
          amount: number
          category: string
          payment_method?: string
          description: string
          vendor?: string | null
          receipt?: boolean
          receipt_url?: string | null
          notes?: string | null
          is_recurring?: boolean
          recurrence_frequency?: string | null
          recurrence_interval?: number | null
          recurrence_end_date?: string | null
          currency?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_email?: string | null
          user_name?: string | null
          created_at?: string
          updated_at?: string
          date?: string
          amount?: number
          category?: string
          payment_method?: string
          description?: string
          vendor?: string | null
          receipt?: boolean
          receipt_url?: string | null
          notes?: string | null
          is_recurring?: boolean
          recurrence_frequency?: string | null
          recurrence_interval?: number | null
          recurrence_end_date?: string | null
          currency?: string
        }
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
  }
}
