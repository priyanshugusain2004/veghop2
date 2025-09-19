import React from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import App from './App.js'

// Safety: override window.alert to avoid pop-up interruptions (use console warning instead)
if (typeof window !== 'undefined') {
	// Replace native alert with a non-blocking in-app event dispatch.
	// This prevents browser modal popups while keeping messages available to the app.
	window.alert = function (msg) {
		try {
			const evt = new CustomEvent('veghop:alert', { detail: String(msg) })
			window.dispatchEvent(evt)
		} catch (e) {
			/* ignore */
		}
		// Do not call the native alert to avoid modal popups.
	}
}

const root = createRoot(document.getElementById('root'))
root.render(React.createElement(App))
