import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Client-side Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      "x-my-custom-header": "carbonwise-tracker",
    },
  },
})

// Server-side Supabase client
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Connection test function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("activity_categories").select("id").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    console.log("Supabase connection test successful")
    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection test exception:", error)
    return { success: false, error: error.message }
  }
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          total_carbon_saved: number
          streak_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          total_carbon_saved?: number
          streak_days?: number
        }
        Update: {
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          total_carbon_saved?: number
          streak_days?: number
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          category_id: number
          name: string
          description: string | null
          carbon_amount: number
          date: string
          created_at: string
          quantity?: number
          unit?: string
          emission_factor_id?: number
          auto_calculated?: boolean
        }
        Insert: {
          user_id: string
          category_id: number
          name: string
          description?: string | null
          carbon_amount: number
          date?: string
          quantity?: number
          unit?: string
          emission_factor_id?: number
          auto_calculated?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          carbon_amount?: number
          date?: string
          quantity?: number
          unit?: string
        }
      }
      activity_categories: {
        Row: {
          id: number
          name: string
          icon: string | null
          color: string | null
          created_at: string
        }
      }
      badges: {
        Row: {
          id: number
          name: string
          description: string | null
          icon: string | null
          requirement_type: string | null
          requirement_value: number | null
          created_at: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: number
          earned_at: string
        }
        Insert: {
          user_id: string
          badge_id: number
        }
      }
      suggestions: {
        Row: {
          id: number
          category_id: number | null
          title: string
          description: string | null
          potential_savings: number | null
          difficulty: string | null
          created_at: string
        }
      }
    }
  }
}
