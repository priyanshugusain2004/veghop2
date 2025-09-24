import React, { useState } from 'react'
import { useUser } from '../context/UserContext.js'

export default function UserSelection({ onNext }) {
  const { users, createOrSelectUser } = useUser()
  const [name, setName] = useState('')

  function handleNew() {
    const trimmed = name.trim() || `Guest-${Math.floor(Math.random()*9000+1000)}`
    createOrSelectUser(trimmed)
    onNext()
  }

  return (
    React.createElement('section', { className: 'bg-white p-4 sm:p-6 rounded-lg shadow-md' },
      React.createElement('h2', { className: 'text-2xl sm:text-3xl font-semibold mb-4' }, 'User / उपयोगकर्ता'),

      React.createElement('div', { className: 'mb-4' },
        React.createElement('label', { className: 'block mb-2 text-lg' }, 'Select Existing / पहले से मौजूद: '),
        React.createElement('div', { className: 'flex flex-wrap gap-2' },
          Object.keys(users).length === 0 && React.createElement('div', { className: 'text-gray-500' }, 'No users yet'),
          Object.keys(users).map(u => (
            React.createElement('button', {
              key: u,
              onClick: () => { createOrSelectUser(u); onNext() },
              className: 'px-4 py-3 bg-indigo-600 text-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'
            }, u)
          ))
        )
      ),

      React.createElement('div', { className: 'mb-4' },
        React.createElement('label', { className: 'block mb-2 text-lg' }, 'New User Name / नया नाम:'),
        React.createElement('input', {
          value: name,
          onChange: e => setName(e.target.value),
          placeholder: 'Enter name / नाम दर्ज करें',
          className: 'w-full p-3 border rounded-lg text-lg'
        })
      ),

      React.createElement('div', { className: 'flex flex-col sm:flex-row gap-3' },
        React.createElement('button', { onClick: handleNew, className: 'w-full sm:flex-1 p-4 bg-green-600 text-white rounded-lg text-xl' }, 'Continue / जारी रखें'),
        React.createElement('button', { onClick: () => { const rnd = `Guest-${Math.floor(Math.random()*9000+1000)}`; createOrSelectUser(rnd); onNext() }, className: 'w-full sm:w-auto p-4 bg-gray-300 rounded-lg text-xl' }, 'Quick Guest / अतिथि')
      )
    )
  )
}
