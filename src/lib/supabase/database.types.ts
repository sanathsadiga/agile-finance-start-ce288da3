
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
      invoices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          date: string
          due_date: string | null
          customer: string | null
          email: string | null
          amount: number
          status: 'paid' | 'pending' | 'overdue' | 'draft' | 'unpaid'
          description: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          date: string
          due_date?: string | null
          customer?: string | null
          email?: string | null
          amount: number
          status: 'paid' | 'pending' | 'overdue' | 'draft' | 'unpaid'
          description?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          date?: string
          due_date?: string | null
          customer?: string | null
          email?: string | null
          amount?: number
          status?: 'paid' | 'pending' | 'overdue' | 'draft' | 'unpaid'
          description?: string | null
          notes?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          date: string
          amount: number
          category: string
          description: string
          vendor: string | null
          receipt: boolean | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          date: string
          amount: number
          category: string
          description: string
          vendor?: string | null
          receipt?: boolean | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          date?: string
          amount?: number
          category?: string
          description?: string
          vendor?: string | null
          receipt?: boolean | null
          notes?: string | null
        }
      }
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
