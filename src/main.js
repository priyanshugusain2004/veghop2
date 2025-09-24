import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'

// Safety: make window.alert a no-op to avoid any native modal popups
if (typeof window !== 'undefined') {
	window.alert = function (msg) {
		// Silent no-op for user-facing alerts; log to console for debugging
		try { console.log('suppressed alert:', String(msg)) } catch (e) { /* ignore */ }
	}
}

const root = createRoot(document.getElementById('root'))
root.render(React.createElement(App))
