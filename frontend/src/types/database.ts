// Database types generated from Supabase schema
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
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      style_profiles: {
        Row: {
          id: string
          user_id: string
          writing_style: Json
          vocabulary_patterns: Json
          management_preferences: Json
          tone_analysis: Json
          sample_count: number
          last_analyzed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          writing_style?: Json
          vocabulary_patterns?: Json
          management_preferences?: Json
          tone_analysis?: Json
          sample_count?: number
          last_analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          writing_style?: Json
          vocabulary_patterns?: Json
          management_preferences?: Json
          tone_analysis?: Json
          sample_count?: number
          last_analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_items: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          item_type: 'document' | 'voice_note' | 'snippet' | 'web_clip'
          file_path: string | null
          file_size: number | null
          mime_type: string | null
          transcription: string | null
          summary: string | null
          tags: string[]
          metadata: Json
          embedding: number[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          item_type: 'document' | 'voice_note' | 'snippet' | 'web_clip'
          file_path?: string | null
          file_size?: number | null
          mime_type?: string | null
          transcription?: string | null
          summary?: string | null
          tags?: string[]
          metadata?: Json
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          item_type?: 'document' | 'voice_note' | 'snippet' | 'web_clip'
          file_path?: string | null
          file_size?: number | null
          mime_type?: string | null
          transcription?: string | null
          summary?: string | null
          tags?: string[]
          metadata?: Json
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          ai_priority_score: number | null
          due_date: string | null
          start_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          completed_at: string | null
          tags: string[]
          metadata: Json
          parent_task_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          ai_priority_score?: number | null
          due_date?: string | null
          start_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          completed_at?: string | null
          tags?: string[]
          metadata?: Json
          parent_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          ai_priority_score?: number | null
          due_date?: string | null
          start_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          completed_at?: string | null
          tags?: string[]
          metadata?: Json
          parent_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'draft' | 'active' | 'paused' | 'archived'
          definition: Json
          trigger_config: Json | null
          version: number
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'draft' | 'active' | 'paused' | 'archived'
          definition: Json
          trigger_config?: Json | null
          version?: number
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'draft' | 'active' | 'paused' | 'archived'
          definition?: Json
          trigger_config?: Json | null
          version?: number
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          service_name: string
          display_name: string | null
          credentials: Json | null
          config: Json
          is_active: boolean
          last_sync_at: string | null
          sync_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_name: string
          display_name?: string | null
          credentials?: Json | null
          config?: Json
          is_active?: boolean
          last_sync_at?: string | null
          sync_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_name?: string
          display_name?: string | null
          credentials?: Json | null
          config?: Json
          is_active?: boolean
          last_sync_at?: string | null
          sync_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_knowledge_items: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
          filter_user_id: string
        }
        Returns: {
          id: string
          title: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      task_status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      knowledge_item_type: 'document' | 'voice_note' | 'snippet' | 'web_clip'
      workflow_status: 'draft' | 'active' | 'paused' | 'archived'
      execution_status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    }
  }
}
