const KEYS = {
  tasks: 'flowforge_tasks',
  energy: 'flowforge_energy',
  schedule: 'flowforge_schedule',
  history: 'flowforge_history',
}

export function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(KEYS[key])
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveLocal(key, value) {
  localStorage.setItem(KEYS[key], JSON.stringify(value))
}

export function clearLocal(key) {
  localStorage.removeItem(KEYS[key])
}
