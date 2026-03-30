const DEFAULT_START_HOUR = 8

function toClock(minutesFromMidnight) {
  const hours = Math.floor(minutesFromMidnight / 60)
  const minutes = minutesFromMidnight % 60
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = ((hours + 11) % 12) + 1
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function rankedWindows(energy) {
  return [
    { name: 'morning', score: energy.morning, start: 8 * 60 },
    { name: 'afternoon', score: energy.afternoon, start: 13 * 60 },
    { name: 'evening', score: energy.evening, start: 18 * 60 },
  ].sort((a, b) => b.score - a.score)
}

export function normalizeTasks(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((title, index) => ({
      title,
      estimated_minutes: index < 3 ? 60 : 30,
      priority: index < 2 ? 'high' : 'medium',
    }))
}

export function buildFallbackSchedule(tasks, energy) {
  const windows = rankedWindows(energy)
  let cursor = DEFAULT_START_HOUR * 60

  return tasks.slice(0, 8).map((task, index) => {
    const preferred = windows[Math.min(index, windows.length - 1)]
    if (cursor < preferred.start) cursor = preferred.start

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
      notes: task.priority === 'high'
        ? 'Placed in a stronger energy window.'
        : 'Grouped as lighter work.',
    }
  })
}
