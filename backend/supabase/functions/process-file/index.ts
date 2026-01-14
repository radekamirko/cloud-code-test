// Edge Function: Process uploaded files and extract content
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FileProcessRequest {
  user_id: string
  file_path: string
  mime_type: string
  knowledge_item_id: string
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

    const { user_id, file_path, mime_type, knowledge_item_id }: FileProcessRequest =
      await req.json()

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('documents')
      .download(file_path)

    if (downloadError) throw downloadError

    // Extract text based on mime type
    let extractedText = ''

    if (mime_type === 'text/plain' || mime_type === 'text/markdown') {
      extractedText = await fileData.text()
    } else if (mime_type === 'application/pdf') {
      // In production, use a PDF parsing library
      extractedText = '[PDF content extraction would go here]'
    } else if (
      mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // In production, use a DOCX parsing library
      extractedText = '[DOCX content extraction would go here]'
    }

    // Generate summary (in production, use AI)
    const summary = generateSummary(extractedText)

    // Generate embedding (in production, use OpenAI/Claude)
    // For now, create a placeholder
    const embedding = null

    // Update knowledge item with extracted content
    const { error: updateError } = await supabaseClient
      .from('knowledge_items')
      .update({
        content: extractedText,
        summary,
        embedding,
        updated_at: new Date().toISOString(),
      })
      .eq('id', knowledge_item_id)
      .eq('user_id', user_id)

    if (updateError) throw updateError

    // Trigger style analysis
    const analyzeResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/analyze-style`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.get('Authorization')!,
        },
        body: JSON.stringify({
          user_id,
          content: extractedText,
          item_type: 'document',
        }),
      }
    )

    return new Response(
      JSON.stringify({
        success: true,
        extracted_length: extractedText.length,
        summary,
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

function generateSummary(text: string): string {
  // Simple extractive summary (first 200 chars)
  // In production, use AI for proper summarization
  if (text.length <= 200) return text
  return text.substring(0, 200).trim() + '...'
}
