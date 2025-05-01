
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
