import React from 'https://esm.sh/react@18.2.0'
import { useUser } from '../context/UserContext.js'

export default function Checkout({ onContinue, onNewUser }) {
  const { users, currentUser, clearCart } = useUser()
  const cart = currentUser && users[currentUser] ? users[currentUser].cart : []

  const total = cart.reduce((s,i) => s + (i.subtotal || 0), 0)

  const [amountReceived, setAmountReceived] = React.useState('')
  const receivedNum = parseFloat(String(amountReceived).replace(/[^0-9.-]/g, '')) || 0
  const change = receivedNum - total

  function handleFinish() {
    // For demo, require received amount >= total
    if (receivedNum < total) {
      console.warn('Amount received is less than total / राशि अपर्याप्त')
      return
    }
    // For demo, clear cart but keep user
    clearCart()
    console.log(`Payment simulated. Change: ₹${change.toFixed(2)}`)
    onContinue()
  }

  return (
    React.createElement('section', { className: 'bg-white p-4 sm:p-6 rounded-lg shadow-md' },
      React.createElement('h2', { className: 'text-2xl sm:text-3xl font-semibold mb-4' }, 'Checkout / बिल'),

      cart.length === 0 ? React.createElement('div', { className: 'p-4 text-gray-600' }, 'No items to bill / कोई आइटम नहीं') : (
        React.createElement('div', null,
          cart.map(item => (
            React.createElement('div', { key: item.id, className: 'flex flex-col sm:flex-row justify-between py-3 border-b gap-2' },
              React.createElement('div', null, React.createElement('div', { className: 'text-lg font-medium' }, `${item.name} (${item.hindi})`), React.createElement('div', { className: 'text-sm text-gray-600' }, `${(item.qtyKg*1000)} g × ₹${item.pricePerKg}/kg`)),
              React.createElement('div', { className: 'text-lg font-semibold self-end sm:self-center' }, `₹${item.subtotal.toFixed(2)}`)
            )
          )),
          React.createElement('div', { className: 'mt-6 text-right' },
            React.createElement('div', { className: 'text-4xl sm:text-5xl font-extrabold text-indigo-700' }, `Total: ₹${total.toFixed(2)}`)
          )
        )
      ),

      React.createElement('div', { className: 'mt-4' },
        React.createElement('label', { className: 'block text-sm text-gray-700 mb-2' }, 'Amount received (₹) / प्राप्त राशि'),
        React.createElement('input', { type: 'number', value: amountReceived, onChange: e => setAmountReceived(e.target.value), className: 'p-3 w-full sm:w-56 border rounded-lg text-xl', placeholder: 'Enter amount received' }),
        React.createElement('div', { className: 'mt-2 text-right text-lg font-medium' }, change >= 0 ? `Change: ₹${change.toFixed(2)}` : 'Amount insufficient')
      ),

      React.createElement('div', { className: 'mt-6 flex flex-col sm:flex-row gap-3' },
        React.createElement('button', { onClick: onContinue, className: 'w-full sm:flex-1 p-4 bg-gray-200 rounded-lg text-xl' }, 'Back / वापस'),
        React.createElement('div', { className: 'flex gap-2 w-full sm:flex-1' },
          React.createElement('button', { onClick: () => setAmountReceived(total.toFixed(2)), className: 'flex-1 p-4 bg-yellow-500 text-white rounded-lg text-xl' }, 'Exact / Exact'),
          React.createElement('button', { onClick: handleFinish, disabled: receivedNum < total, className: `flex-1 p-4 rounded-lg text-xl ${receivedNum < total ? 'bg-gray-300 text-gray-700' : 'bg-green-600 text-white'}` }, 'Pay (Simulated) / भुगतान करें')
        ),
        React.createElement('button', { onClick: onNewUser, className: 'w-full sm:w-auto p-4 bg-red-500 text-white rounded-lg text-xl' }, 'New User / नया उपयोगकर्ता')
      )
    )
  )
}
