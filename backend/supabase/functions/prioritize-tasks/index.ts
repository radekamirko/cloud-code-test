// Edge Function: AI-powered task prioritization
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  estimated_hours: number | null
  tags: string[]
  created_at: string
  parent_task_id: string | null
}

interface PrioritizationRequest {
  user_id: string
  task_ids?: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { user_id, task_ids }: PrioritizationRequest = await req.json()

    // Fetch tasks to prioritize
    let query = supabaseClient
      .from('tasks')
      .select('*')
      .eq('user_id', user_id)
      .in('status', ['backlog', 'todo', 'in_progress'])

    if (task_ids && task_ids.length > 0) {
      query = query.in('id', task_ids)
    }

    const { data: tasks, error } = await query

    if (error) throw error
    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No tasks to prioritize' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Calculate priority scores
    const scoredTasks = tasks.map((task: Task) => ({
      id: task.id,
      score: calculatePriorityScore(task),
    }))

    // Update tasks with new AI priority scores
    const updates = scoredTasks.map(({ id, score }) =>
      supabaseClient
        .from('tasks')
        .update({ ai_priority_score: score })
        .eq('id', id)
    )

    await Promise.all(updates)

    return new Response(
      JSON.stringify({
        success: true,
        prioritized_count: scoredTasks.length,
        scores: scoredTasks,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function calculatePriorityScore(task: Task): number {
  let score = 50 // Base score

  // Factor 1: Due date urgency (0-30 points)
  if (task.due_date) {
    const daysUntilDue = Math.floor(
      (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntilDue < 0) {
      score += 30 // Overdue
    } else if (daysUntilDue === 0) {
      score += 25 // Due today
    } else if (daysUntilDue === 1) {
      score += 20 // Due tomorrow
    } else if (daysUntilDue <= 3) {
      score += 15 // Due within 3 days
    } else if (daysUntilDue <= 7) {
      score += 10 // Due within a week
    } else if (daysUntilDue <= 14) {
      score += 5 // Due within 2 weeks
    }
  }

  // Factor 2: Manual priority (0-20 points)
  const priorityMap: Record<string, number> = {
    urgent: 20,
    high: 15,
    medium: 10,
    low: 5,
  }
  score += priorityMap[task.priority] || 10

  // Factor 3: Status (adjust based on status)
  if (task.status === 'in_progress') {
    score += 15 // Boost tasks already in progress
  }

  // Factor 4: Task age (0-10 points)
  const daysOld = Math.floor(
    (Date.now() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysOld > 30) {
    score += 10 // Old tasks get a boost
  } else if (daysOld > 14) {
    score += 5
  }

  // Factor 5: Estimated effort (penalize large tasks slightly)
  if (task.estimated_hours) {
    if (task.estimated_hours > 20) {
      score -= 5 // Large tasks get slight penalty
    } else if (task.estimated_hours <= 2) {
      score += 5 // Quick wins get boost
    }
  }

  // Factor 6: Has parent task (reduce priority for subtasks)
  if (task.parent_task_id) {
    score -= 5
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)))
}
