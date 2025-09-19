import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0'

// Client-only admin for single-device use: set-on-first-run salted SHA-256 hash stored in localStorage.
// Not suitable for public deployments — prefer server-side auth.
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hashWithSalt(password, saltHex) {
  // Use Web Crypto when available. If not available (insecure context), fall back to a simple JS hash
  const enc = new TextEncoder()
  let saltBytes = new Uint8Array(0)
  try {
    if (saltHex && typeof saltHex === 'string') {
      const pairs = saltHex.match(/.{1,2}/g) || []
      saltBytes = new Uint8Array(pairs.map(h => parseInt(h, 16)))
    }
  } catch (e) {
    saltBytes = new Uint8Array(0)
  }

  const passBytes = enc.encode(password)
  const data = new Uint8Array(saltBytes.length + passBytes.length)
  data.set(saltBytes, 0)
  data.set(passBytes, saltBytes.length)

  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const hash = await crypto.subtle.digest('SHA-256', data)
    return bufToHex(hash)
  }

  // Fallback (not cryptographically secure): simple xorshift-like hash to avoid runtime errors
  // NOTE: this fallback is only to prevent the app from crashing in non-HTTPS/dev environments.
  let h = 2166136261 >>> 0
  for (let i = 0; i < data.length; i++) {
    h ^= data[i]
    h = Math.imul(h, 16777619) >>> 0
  }
  // Convert to hex string repeated to reach 32 bytes worth of hex (simulate 256-bit)
  const hex = h.toString(16).padStart(8, '0')
  return hex.repeat(8)
}

function makeSaltHex() {
  // Prefer secure random; fall back to Math.random if unavailable
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint8Array(12)
      crypto.getRandomValues(arr)
      return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
    }
  } catch (e) {
    // fall through
  }
  // Fallback (less secure)
  const bytes = []
  for (let i = 0; i < 12; i++) {
    bytes.push(Math.floor(Math.random() * 256))
  }
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function AdminLogin({ onLogin, onCancel }) {
  const [mode, setMode] = useState('login') // 'login' or 'setup'
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [blockedUntil, setBlockedUntil] = useState(null)

  useEffect(() => {
    const hash = localStorage.getItem('veghop:adminHash')
    if (!hash) setMode('setup')
    // check if blocked
    const blocked = parseInt(localStorage.getItem('veghop:adminBlockedUntil') || '0', 10)
    if (blocked && blocked > Date.now()) setBlockedUntil(blocked)
  }, [])

  function setErrorTimed(msg) {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  async function handleSetup(e) {
    e.preventDefault()
    if (!newPassword) return setErrorTimed('Enter a password / पासवर्ड दर्ज करें')
    if (newPassword !== confirmPassword) return setErrorTimed('Passwords do not match / पासवर्ड मेल नहीं खाते')
    try {
      const salt = makeSaltHex()
      const h = await hashWithSalt(newPassword, salt)
      localStorage.setItem('veghop:adminSalt', salt)
      localStorage.setItem('veghop:adminHash', h)
      // reset attempts
      localStorage.removeItem('veghop:adminAttempts')
      localStorage.removeItem('veghop:adminBlockedUntil')
      onLogin()
    } catch (err) {
      console.error(err)
      setErrorTimed('Could not set password')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    const blocked = parseInt(localStorage.getItem('veghop:adminBlockedUntil') || '0', 10)
    if (blocked && blocked > Date.now()) {
      setBlockedUntil(blocked)
      return setErrorTimed('Too many attempts. Try again later / बहुत प्रयास। बाद में प्रयास करें')
    }
    try {
      const salt = localStorage.getItem('veghop:adminSalt')
      const stored = localStorage.getItem('veghop:adminHash')
      if (!salt || !stored) return setErrorTimed('Admin not configured. Set password first.')
      const h = await hashWithSalt(password, salt)
      if (h === stored) {
        // success
        localStorage.removeItem('veghop:adminAttempts')
        localStorage.removeItem('veghop:adminBlockedUntil')
        onLogin()
      } else {
        // failure: increment attempts
        const attempts = parseInt(localStorage.getItem('veghop:adminAttempts') || '0', 10) + 1
        localStorage.setItem('veghop:adminAttempts', String(attempts))
        if (attempts >= 5) {
          const blockFor = 5 * 60 * 1000 // 5 minutes
          const until = Date.now() + blockFor
          localStorage.setItem('veghop:adminBlockedUntil', String(until))
          setBlockedUntil(until)
          setErrorTimed('Too many attempts. Blocked for 5 minutes / 5 मिनट के लिए अवरुद्ध')
        } else {
          setErrorTimed('Invalid password / गलत पासवर्ड')
        }
      }
    } catch (err) {
      console.error(err)
      setErrorTimed('Login error')
    }
  }

  return (
    React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50' },
      React.createElement('div', { className: 'bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-2 sm:mx-0' },
        React.createElement('h2', { className: 'text-lg sm:text-xl font-bold mb-4 text-center text-gray-800' }, 'Admin Access / एडमिन एक्सेस'),

        mode === 'setup' ? (
          React.createElement('form', { onSubmit: handleSetup, className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Set admin password / व्यवस्थापक पासवर्ड सेट करें'),
              React.createElement('input', { type: 'password', value: newPassword, onChange: e => setNewPassword(e.target.value), className: 'w-full px-3 py-3 text-base border border-gray-300 rounded-lg', placeholder: 'Enter new password', required: true })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Confirm password / पासवर्ड की पुष्टि करें'),
              React.createElement('input', { type: 'password', value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), className: 'w-full px-3 py-3 text-base border border-gray-300 rounded-lg', placeholder: 'Confirm password', required: true })
            ),
            error && React.createElement('div', { className: 'text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg' }, error),
            React.createElement('div', { className: 'flex gap-3' },
              React.createElement('button', { type: 'submit', className: 'flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg' }, 'Set Password / पासवर्ड सेट करें'),
              React.createElement('button', { type: 'button', onClick: onCancel, className: 'flex-1 px-4 py-3 border rounded-lg' }, 'Cancel / रद्द करें')
            )
          )
        ) : (
          React.createElement('form', { onSubmit: handleLogin, className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Password / पासवर्ड'),
              React.createElement('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), className: 'w-full px-3 py-3 text-base border border-gray-300 rounded-lg', placeholder: 'Enter admin password', required: true })
            ),
            blockedUntil && React.createElement('div', { className: 'text-yellow-700 text-sm text-center bg-yellow-50 p-2 rounded-lg' }, `Blocked until: ${new Date(blockedUntil).toLocaleTimeString()}`),
            error && React.createElement('div', { className: 'text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg' }, error),
            React.createElement('div', { className: 'flex gap-3' },
              React.createElement('button', { type: 'submit', className: 'flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg' }, 'Login / लॉगिन'),
              React.createElement('button', { type: 'button', onClick: onCancel, className: 'flex-1 px-4 py-3 border rounded-lg' }, 'Cancel / रद्द करें')
            )
          )
        ),

        React.createElement('div', { className: 'mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 text-center' }, 'This admin is local-only. For public use, add server auth / यह एडमिन केवल स्थानीय उपयोग के लिए है।')
      )
    )
  )
}
