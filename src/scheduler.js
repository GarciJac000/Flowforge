const DEFAULT_START_HOUR = 8

function toClock(minutesFromMidnight) {
  const hours = Math.floor(minutesFromMidnight / 60)
  const minutes = minutesFromMidnight % 60
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = ((hours + 11) % 12) + 1
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function pickWindow(taskIndex, energy) {
  const ranked = [
    { label: 'morning', score: energy.morning, start: 8 * 60 },
    { label: 'afternoon', score: energy.afternoon, start: 13 * 60 },
    { label: 'evening', score: energy.evening, start: 18 * 60 },
  ].sort((a, b) => b.score - a.score)

  return ranked[Math.min(taskIndex, ranked.length - 1)]
}

export function normalizeTasks(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((title, index) => ({
      title,
      estimated_minutes: index < 2 ? 60 : 30,
      priority: index < 2 ? 'high' : 'medium',
    }))
}

export function buildFallbackSchedule(tasks, energy) {
  let cursor = DEFAULT_START_HOUR * 60

  return tasks.slice(0, 8).map((task, index) => {
    const window = pickWindow(index, energy)
    if (cursor < window.start) cursor = window.start

    const start = cursor
    const duration = task.estimated_minutes || 30
    const end = start + duration
    cursor = end + 10

    return {
      start_time: toClock(start),
      end_time: toClock(end),
      title: task.title,
      type: task.priority === 'high' ? 'focus' : 'admin',
      estimated_minutes: duration,
      notes: task.priority === 'high' ? 'Placed during a stronger energy window.' : 'Grouped as lighter work.',
    }
  })
}
