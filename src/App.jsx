import { useState } from 'react'

export default function App() {
  const [tasks, setTasks] = useState('')
  const [energy, setEnergy] = useState({ morning:5, afternoon:5, evening:5 })

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">FlowForge</h1>

      <textarea
        className="w-full p-3 rounded bg-gray-800"
        placeholder="Dump your tasks..."
        value={tasks}
        onChange={(e)=>setTasks(e.target.value)}
      />

      <div className="mt-4">
        <label>Morning Energy: {energy.morning}</label>
        <input type="range" min="1" max="10" value={energy.morning}
          onChange={(e)=>setEnergy({...energy, morning:e.target.value})}/>
      </div>

      <button className="mt-6 w-full bg-blue-500 p-3 rounded">
        Forge My Day
      </button>
    </div>
  )
}
