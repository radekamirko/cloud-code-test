// Edge Function: Analyze writing style from knowledge items
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StyleAnalysisRequest {
  user_id: string
  content: string
  item_type: string
}

interface StyleProfile {
  writing_style: {
    sentence_length_avg: number
    vocabulary_complexity: number
    tone: string
    formality_level: number
  }
  vocabulary_patterns: {
    common_phrases: string[]
    preferred_terms: Record<string, number>
  }
  management_preferences: {
    prioritization_style: string
    communication_style: string
  }
}

serve(async (req) => {
  // Handle CORS
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

    // Get the request payload
    const { user_id, content, item_type }: StyleAnalysisRequest = await req.json()

    // Basic style analysis (in production, use OpenAI/Claude API)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/)
    const avgSentenceLength = words.length / sentences.length || 0

    // Calculate vocabulary complexity (unique words / total words)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const vocabularyComplexity = uniqueWords.size / words.length || 0

    // Detect tone (simplified - in production use AI)
    const positiveSentiment = content.match(/\b(great|excellent|good|positive|success)\b/gi)?.length || 0
    const negativeSentiment = content.match(/\b(bad|poor|negative|fail|problem)\b/gi)?.length || 0
    const tone = positiveSentiment > negativeSentiment ? 'positive' :
                 negativeSentiment > positiveSentiment ? 'negative' : 'neutral'

    // Build style profile
    const styleUpdate: Partial<StyleProfile> = {
      writing_style: {
        sentence_length_avg: Math.round(avgSentenceLength * 10) / 10,
        vocabulary_complexity: Math.round(vocabularyComplexity * 100) / 100,
        tone,
        formality_level: avgSentenceLength > 15 ? 0.7 : 0.4, // Simplified
      },
      vocabulary_patterns: {
        common_phrases: extractPhrases(content),
        preferred_terms: countTerms(words),
      },
    }

    // Update or create style profile
    const { data: existingProfile } = await supabaseClient
      .from('style_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (existingProfile) {
      // Merge with existing profile (weighted average)
      const sampleCount = existingProfile.sample_count + 1
      const updatedProfile = mergeProfiles(existingProfile, styleUpdate, sampleCount)

      await supabaseClient
        .from('style_profiles')
        .update({
          ...updatedProfile,
          sample_count: sampleCount,
          last_analyzed_at: new Date().toISOString(),
        })
        .eq('user_id', user_id)
    } else {
      await supabaseClient
        .from('style_profiles')
        .insert({
          user_id,
          ...styleUpdate,
          sample_count: 1,
          last_analyzed_at: new Date().toISOString(),
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: styleUpdate,
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

// Helper functions
function extractPhrases(text: string): string[] {
  // Extract 2-3 word phrases (simplified)
  const words = text.toLowerCase().split(/\s+/)
  const phrases: string[] = []

  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`
    if (phrase.length > 5 && phrase.length < 30) {
      phrases.push(phrase)
    }
  }

  // Return top 10 most common
  const counts = phrases.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase]) => phrase)
}

function countTerms(words: string[]): Record<string, number> {
  const counts: Record<string, number> = {}
  words.forEach(word => {
    const normalized = word.toLowerCase().replace(/[^a-z]/g, '')
    if (normalized.length > 3) {
      counts[normalized] = (counts[normalized] || 0) + 1
    }
  })

  // Return top 20
  return Object.fromEntries(
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
  )
}

function mergeProfiles(
  existing: any,
  update: Partial<StyleProfile>,
  sampleCount: number
): any {
  // Weighted average for numeric values
  const weight = 1 / sampleCount

  return {
    writing_style: {
      sentence_length_avg:
        existing.writing_style.sentence_length_avg * (1 - weight) +
        update.writing_style!.sentence_length_avg * weight,
      vocabulary_complexity:
        existing.writing_style.vocabulary_complexity * (1 - weight) +
        update.writing_style!.vocabulary_complexity * weight,
      tone: update.writing_style!.tone, // Use latest
      formality_level:
        existing.writing_style.formality_level * (1 - weight) +
        update.writing_style!.formality_level * weight,
    },
    vocabulary_patterns: {
      common_phrases: [
        ...existing.vocabulary_patterns.common_phrases,
        ...update.vocabulary_patterns!.common_phrases,
      ].slice(0, 20),
      preferred_terms: {
        ...existing.vocabulary_patterns.preferred_terms,
        ...update.vocabulary_patterns!.preferred_terms,
      },
    },
    management_preferences: existing.management_preferences,
  }
}
