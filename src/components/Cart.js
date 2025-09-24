import React from 'react'
import { useUser } from '../context/UserContext.js'

export default function Cart({ onAddMore, onCheckout, onBack }) {
  const { users, currentUser } = useUser()
  const cart = currentUser && users[currentUser] ? users[currentUser].cart : []

  const total = cart.reduce((s,i) => s + (i.subtotal || 0), 0)
  const [amountReceived, setAmountReceived] = React.useState('')
  const receivedNum = parseFloat(String(amountReceived).replace(/[^0-9.-]/g, '')) || 0
  const change = receivedNum - total

  return (
    React.createElement('section', { className: 'bg-white p-4 sm:p-6 rounded-lg shadow-md' },
      React.createElement('h2', { className: 'text-2xl sm:text-3xl font-semibold mb-4' }, `Cart for ${currentUser || '—'}`),

      cart.length === 0 ? React.createElement('div', { className: 'p-4 text-gray-600' }, 'Cart is empty / कार्ट खाली है') : (
        React.createElement('div', null,
          cart.map(item => (
            React.createElement('div', { key: item.id, className: 'flex flex-col sm:flex-row justify-between py-3 border-b gap-2' },
              React.createElement('div', null, React.createElement('div', { className: 'text-lg font-medium' }, `${item.name} (${item.hindi})`), React.createElement('div', { className: 'text-sm text-gray-600' }, `${(item.qtyKg*1000)} g × ₹${item.pricePerKg}/kg`)),
              React.createElement('div', { className: 'text-lg font-semibold self-end sm:self-center' }, `₹${item.subtotal.toFixed(2)}`)
            )
          )),
          React.createElement('div', { className: 'mt-4 text-right' },
            React.createElement('div', { className: 'text-3xl sm:text-4xl font-bold' }, `Total: ₹${total.toFixed(2)}`)
          )
        )
      ),

      React.createElement('div', { className: 'mt-4' },
        React.createElement('label', { className: 'block text-sm text-gray-700 mb-2' }, 'Amount received (₹) / प्राप्त राशि'),
        React.createElement('input', { type: 'number', value: amountReceived, onChange: e => setAmountReceived(e.target.value), className: 'p-3 w-full sm:w-56 border rounded-lg text-xl', placeholder: 'Enter amount received' }),
        React.createElement('div', { className: 'mt-2 text-right text-lg font-medium' }, change >= 0 ? `Change: ₹${change.toFixed(2)}` : 'Amount insufficient')
      ),

      React.createElement('div', { className: 'mt-6 flex flex-col sm:flex-row gap-3' },
        React.createElement('button', { onClick: onBack, className: 'w-full sm:flex-1 p-4 bg-gray-300 rounded-lg text-xl' }, 'Back / वापस'),
        React.createElement('button', { onClick: onAddMore, className: 'w-full sm:flex-1 p-4 bg-gray-200 rounded-lg text-xl' }, 'Add More / और जोड़ें'),
        React.createElement('div', { className: 'flex gap-2 w-full sm:flex-1' },
          React.createElement('button', { onClick: () => setAmountReceived(total.toFixed(2)), className: 'flex-1 p-4 bg-yellow-500 text-white rounded-lg text-xl' }, 'Exact / Exact'),
          React.createElement('button', { onClick: onCheckout, disabled: receivedNum < total, className: `flex-1 p-4 rounded-lg text-xl ${receivedNum < total ? 'bg-gray-300 text-gray-700' : 'bg-indigo-600 text-white'}` }, 'Checkout / बिल')
        )
      )
    )
  )
}
