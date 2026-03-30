function sanitizeSchedule(raw) {
  if (!Array.isArray(raw)) throw new Error('Invalid schedule format')

  return raw.map((block) => ({
    start_time: String(block.start_time || ''),
    end_time: String(block.end_time || ''),
    title: String(block.title || 'Untitled block'),
    type: String(block.type || 'focus'),
    estimated_minutes: Number(block.estimated_minutes || 30),
    notes: block.notes ? String(block.notes) : '',
  }))
}

function extractJson(text) {
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array found in model response')
  return JSON.parse(match[0])
}

export async function generateSchedule(tasks, energy) {
  const apiKey = import.meta.env.VITE_OPENAI_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_KEY')
  }

  const prompt = `
You are a productivity scheduling engine.
Create a realistic daily plan from the task list and energy pattern.
Rules:
- Return JSON only
- Output an array
- Each item must include: start_time, end_time, title, type, estimated_minutes, notes
- Use type values like focus, admin, break, deferred
- Do not overload the day
- Match hard tasks to the strongest energy period
- Insert breaks where appropriate

Tasks:
${JSON.stringify(tasks, null, 2)}

Energy:
${JSON.stringify(energy, null, 2)}
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: 'You create realistic time-blocked schedules and return strict JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content || ''
  const parsed = extractJson(content)
  return sanitizeSchedule(parsed)
}
