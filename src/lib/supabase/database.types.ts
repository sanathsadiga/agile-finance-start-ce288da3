
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
      invoice_settings: {
        Row: {
          id: string
          user_id: string
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
          created_at?: string
          updated_at?: string
          tax_enabled?: boolean
          default_tax_rate?: number
          tax_name?: string
          tax_registration_number?: string | null
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
