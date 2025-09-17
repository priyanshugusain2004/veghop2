import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import { useUser } from '../context/UserContext.js'

export default function VegetableList({ onCheckout, onCart, onBackToUser }) {
  const { addToCart, users, currentUser, vegetables, loadVegetables } = useUser()

  // modal state
  const [selected, setSelected] = useState(null) // veg object or null
  const [grams, setGrams] = useState(100)

  useEffect(() => {
    // Reload vegetables in case admin updated prices
    loadVegetables()
  }, [])

  function openModal(veg) {
    setSelected(veg)
    setGrams(100)
  }

  function closeModal() {
    setSelected(null)
  }

  function addSelectedToCart() {
    if (!selected) return
    const qKg = Math.round((grams / 1000) * 1000) / 1000 // preserve 3 decimals
    if (qKg <= 0) { alert('Enter a quantity greater than 0g / 0g से अधिक मात्रा दर्ज करें'); return }
    const subtotal = Math.round((qKg * selected.pricePerKg) * 100) / 100
    const item = {
      id: `${selected.id}-${Date.now()}`,
      vegId: selected.id,
      name: selected.name,
      hindi: selected.hindi,
      pricePerKg: selected.pricePerKg,
      qtyKg: qKg,
      subtotal
    }
    addToCart(item)
    closeModal()
    // friendly confirmation
    setTimeout(() => alert(`${selected.name} (${grams}g) added to cart — ₹${subtotal.toFixed(2)}`), 50)
  }

  function quickPick(g) { setGrams(g) }

  return (
  React.createElement('section', { className: 'bg-white p-4 sm:p-6 rounded-lg shadow-md' },
      React.createElement('div', { className: 'mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3' },
        React.createElement('h2', { className: 'text-2xl font-semibold' }, 'Select Vegetables / सब्जियाँ चुनें'),
        React.createElement('div', { className: 'flex gap-2 w-full sm:w-auto' },
          React.createElement('button', { onClick: onBackToUser, className: 'flex-1 px-3 py-3 bg-gray-300 rounded-lg text-lg' }, 'Change User / उपयोगकर्ता बदलें'),
          React.createElement('button', { onClick: onCheckout, className: 'flex-1 px-3 py-3 bg-indigo-600 text-white rounded-lg text-lg' }, 'Checkout / बिल')
        )
      ),

      // Cart summary panel displayed under header and above veg list
      React.createElement('div', { className: 'mb-4 bg-yellow-50 p-3 rounded-lg border' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('div', null, React.createElement('div', { className: 'text-lg font-medium' }, `Cart: ${currentUser && users[currentUser] ? users[currentUser].cart.length : 0} items`), React.createElement('div', { className: 'text-sm text-gray-600' }, 'Quick summary / त्वरित सारांश')),
          React.createElement('div', { className: 'text-right' }, React.createElement('div', { className: 'text-lg font-semibold' }, `Total: ₹${currentUser && users[currentUser] ? (users[currentUser].cart.reduce((s,i)=>s+(i.subtotal||0),0)).toFixed(2) : '0.00'}`), React.createElement('button', { onClick: onCart, className: 'mt-2 w-full sm:w-auto p-2 bg-yellow-500 rounded-lg text-black' }, 'View Cart / देखें'))
        )
      ),

      React.createElement('div', { className: 'grid grid-cols-1 gap-4 sm:grid-cols-2' },
        vegetables.map(veg => (
          React.createElement('article', { key: veg.id, className: 'flex flex-col sm:flex-row gap-3 items-start p-3 border rounded-lg' },
            React.createElement('button', {
              onClick: () => openModal(veg),
              className: 'flex-shrink-0 focus:outline-none w-full sm:w-28',
              'aria-label': `Add ${veg.name} (${veg.hindi}) to cart`,
              title: `Click to add ${veg.name} — क्लिक करें`,
              style: { border: 'none', background: 'transparent' }
            },
              React.createElement('img', { src: veg.image, alt: `${veg.name}`, className: 'w-full sm:w-28 h-44 sm:h-20 object-cover rounded transform hover:scale-105 transition' })
            ),
            React.createElement('div', { className: 'flex-1' },
              React.createElement('div', { className: 'text-xl font-medium' }, `${veg.name} (${veg.hindi})`),
              React.createElement('div', { className: 'text-lg text-gray-600' }, `Price: ₹${veg.pricePerKg}/kg`),
              React.createElement('div', { className: 'mt-2 text-sm text-gray-500' }, 'Tap the image to select grams and add to cart — छवि पर टैप करें')
            )
          )
        ))
      ),

      // Modal
      selected && React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
        React.createElement('div', { className: 'bg-white rounded-lg w-full h-full max-h-[90vh] sm:max-h-[auto] sm:w-full sm:max-w-xl p-4 sm:p-6 overflow-auto', role: 'dialog', 'aria-modal': 'true', 'aria-label': `Add ${selected.name}` },
          React.createElement('div', { className: 'flex justify-between items-start' },
            React.createElement('div', null, React.createElement('h3', { className: 'text-2xl font-semibold' }, `${selected.name} (${selected.hindi})`), React.createElement('div', { className: 'text-lg text-gray-600' }, `₹${selected.pricePerKg}/kg`)),
            React.createElement('button', { onClick: closeModal, className: 'text-gray-600 text-xl' }, '✕')
          ),

          React.createElement('div', { className: 'mt-4' },
            React.createElement('label', { className: 'block text-lg mb-2' }, 'Quantity (grams) / मात्रा (ग्राम)'),
            React.createElement('div', { className: 'flex gap-2 flex-wrap mb-3' },
              [100,250,500,1000].map(g => (
                React.createElement('button', { key: g, onClick: () => quickPick(g), className: `p-3 rounded-lg text-lg ${grams===g ? 'bg-indigo-600 text-white' : 'bg-gray-200'}` }, `${g}g${g===1000? ' (1kg)':''}`)
              ))
            ),

            React.createElement('div', { className: 'mb-3' },
              React.createElement('input', { type: 'number', value: grams, onChange: e => setGrams(Math.max(0, parseInt(e.target.value||0))), className: 'p-3 w-full sm:w-56 border rounded-lg text-xl' })
            ),

            React.createElement('div', { className: 'text-xl mb-4' }, `You selected: ${grams} g = ${(grams/1000).toFixed(3)} kg — Price: ₹${((grams/1000)*selected.pricePerKg).toFixed(2)}`),

            React.createElement('div', { className: 'flex flex-col sm:flex-row gap-3' },
              React.createElement('button', { onClick: addSelectedToCart, className: 'w-full sm:flex-1 p-4 bg-green-600 text-white rounded-lg text-xl' }, 'Add to Cart / कार्ट में जोड़ें'),
              React.createElement('button', { onClick: closeModal, className: 'w-full sm:w-auto p-4 bg-gray-200 rounded-lg text-xl' }, 'Cancel / रद्द करें')
            )
          )
        )
      )
    )
  )
}
