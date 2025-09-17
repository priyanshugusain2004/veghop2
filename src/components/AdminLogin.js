import React, { useState } from 'https://esm.sh/react@18.2.0'

export default function AdminLogin({ onLogin, onCancel }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      onLogin()
    } else {
      setError('Invalid password / गलत पासवर्ड')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
      React.createElement('div', { className: 'bg-white rounded-lg p-6 w-full max-w-md' },
        React.createElement('h2', { className: 'text-xl font-bold mb-4 text-center' }, 'Admin Access / एडमिन एक्सेस'),
        
        React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Password / पासवर्ड'),
            React.createElement('input', {
              type: 'password',
              value: password,
              onChange: e => setPassword(e.target.value),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              placeholder: 'Enter admin password',
              required: true
            })
          ),

          error && React.createElement('div', { className: 'text-red-600 text-sm text-center' }, error),

          React.createElement('div', { className: 'flex gap-3' },
            React.createElement('button', {
              type: 'button',
              onClick: onCancel,
              className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
            }, 'Cancel / रद्द करें'),
            React.createElement('button', {
              type: 'submit',
              className: 'flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            }, 'Login / लॉगिन')
          )
        ),

        React.createElement('div', { className: 'mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600' }, 'Demo password: admin123')
      )
    )
  )
}
