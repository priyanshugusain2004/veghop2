import React, { useState } from 'https://esm.sh/react@18.2.0'
import { UserProvider } from './context/UserContext.js'
import UserSelection from './components/UserSelection.js'
import VegetableList from './components/VegetableList.js'
import Cart from './components/Cart.js'
import Checkout from './components/Checkout.js'
import AdminLogin from './components/AdminLogin.js'
import AdminPanel from './components/AdminPanel.js'

export default function App() {
  const [screen, setScreen] = useState('user') // 'user' | 'list' | 'cart' | 'checkout' | 'admin'
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  return (
    React.createElement(UserProvider, null,
      React.createElement('div', { className: 'max-w-4xl mx-auto p-4 sm:p-6' },
        React.createElement('header', { className: 'mb-6' },
          React.createElement('h1', { className: 'text-3xl font-bold text-center mb-2' }, 'VegHop - Vegetable Ordering (वेज़हॉप)'),
          React.createElement('p', { className: 'text-center text-lg' }, 'Simple, accessible vegetable ordering and billing — हिंदी + English')
        ),

        // Admin button (fixed position)
        (screen === 'user' || screen === 'list') && React.createElement('div', { className: 'fixed top-4 right-4 z-40' },
          React.createElement('button', {
            onClick: () => setShowAdminLogin(true),
            className: 'px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium'
          }, 'Admin')
        ),

        screen === 'user' && React.createElement(UserSelection, { onNext: () => setScreen('list') }),
        screen === 'list' && React.createElement(VegetableList, { onCheckout: () => setScreen('checkout'), onCart: () => setScreen('cart'), onBackToUser: () => setScreen('user') }),
        screen === 'cart' && React.createElement(Cart, { onAddMore: () => setScreen('list'), onCheckout: () => setScreen('checkout') }),
        screen === 'checkout' && React.createElement(Checkout, { onContinue: () => setScreen('list'), onNewUser: () => setScreen('user') }),
        screen === 'admin' && React.createElement(AdminPanel, { onBack: () => setScreen('list') }),

        // Admin Login Modal
        showAdminLogin && React.createElement(AdminLogin, {
          onLogin: () => { setShowAdminLogin(false); setScreen('admin') },
          onCancel: () => setShowAdminLogin(false)
        })
      )
    )
  )
}
