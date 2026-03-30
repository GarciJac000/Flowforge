export async function generateSchedule(tasks, energy) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a productivity scheduling engine. Return JSON only.",
        },
        {
          role: "user",
          content: `Tasks: ${tasks}\nEnergy: ${JSON.stringify(energy)}`,
        },
      ],
    }),
  })

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}
