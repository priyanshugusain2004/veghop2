import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0'

export default function AdminPanel({ onBack }) {
  const [vegetables, setVegetables] = useState([])
  const [editedVegetables, setEditedVegetables] = useState([])
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    loadVegetables()
  }, [])

  async function loadVegetables() {
    try {
      // Try localStorage first (for previous admin updates)
      const savedPrices = localStorage.getItem('vegetablePrices')
      if (savedPrices) {
        const data = JSON.parse(savedPrices)
        setVegetables(data)
        setEditedVegetables([...data])
        return
      }

      // Fall back to JSON file
      const response = await fetch('/src/data/vegetables.json')
      const data = await response.json()
      setVegetables(data)
      setEditedVegetables([...data])
    } catch (error) {
      console.error('Error loading vegetables:', error)
    }
  }

  function handlePriceChange(id, newPrice) {
    const price = parseFloat(newPrice) || 0
    setEditedVegetables(prev => 
      prev.map(veg => veg.id === id ? { ...veg, pricePerKg: price } : veg)
    )
  }

  async function handleSave() {
    try {
      // Save to localStorage for persistence
      localStorage.setItem('vegetablePrices', JSON.stringify(editedVegetables))
      
      setSaveStatus('✅ Prices updated successfully!')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Error saving prices')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  function handleCSVUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target.result
        const lines = csv.split('\n')
        const header = lines[0].toLowerCase()
        
        if (!header.includes('id') || !header.includes('price')) {
          setSaveStatus('❌ CSV must have "id" and "price" columns')
          return
        }

        const updates = {}
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue
          
          const [id, price] = line.split(',')
          if (id && price) {
            updates[id.trim()] = parseFloat(price.trim()) || 0
          }
        }

        setEditedVegetables(prev => 
          prev.map(veg => ({
            ...veg,
            pricePerKg: updates[veg.id] !== undefined ? updates[veg.id] : veg.pricePerKg
          }))
        )

        setSaveStatus('✅ CSV loaded successfully!')
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (error) {
        setSaveStatus('❌ Error reading CSV file')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  function downloadCurrentPrices() {
    const csvContent = "id,name,hindi,price\n" + 
      editedVegetables.map(veg => 
        `${veg.id},${veg.name},${veg.hindi},${veg.pricePerKg}`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vegetable-prices-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    React.createElement('div', { className: 'min-h-screen bg-gray-50 p-4' },
      React.createElement('div', { className: 'max-w-4xl mx-auto' },
        // Header
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-6 mb-6' },
          React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-2xl font-bold text-gray-800' }, 'Admin Panel / एडमिन पैनल'),
              React.createElement('p', { className: 'text-gray-600' }, 'Update daily vegetable prices / दैनिक सब्जी दरें अपडेट करें')
            ),
            React.createElement('button', {
              onClick: onBack,
              className: 'px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium'
            }, '← Back / वापस')
          )
        ),

        // CSV Upload Section
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-6 mb-6' },
          React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'Bulk Update / बल्क अपडेट'),
          React.createElement('div', { className: 'flex flex-col sm:flex-row gap-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Upload CSV / CSV अपलोड करें'),
              React.createElement('input', {
                type: 'file',
                accept: '.csv',
                onChange: handleCSVUpload,
                className: 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              }),
              React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, 'Format: id,price (e.g., tomato,45)')
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Download Current / वर्तमान डाउनलोड करें'),
              React.createElement('button', {
                onClick: downloadCurrentPrices,
                className: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm'
              }, '📥 Download CSV')
            )
          )
        ),

        // Price Editing
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-6 mb-6' },
          React.createElement('div', { className: 'flex justify-between items-center mb-4' },
            React.createElement('h2', { className: 'text-xl font-semibold' }, 'Edit Prices / कीमतें संपादित करें'),
            React.createElement('button', {
              onClick: handleSave,
              className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium'
            }, '💾 Save All / सभी सेव करें')
          ),

          saveStatus && React.createElement('div', { className: 'mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-center font-medium' }, saveStatus),

          React.createElement('div', { className: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' },
            editedVegetables.map(veg => (
              React.createElement('div', { key: veg.id, className: 'border rounded-lg p-4' },
                React.createElement('div', { className: 'flex items-center gap-3 mb-3' },
                  React.createElement('img', { 
                    src: veg.image, 
                    alt: veg.name,
                    className: 'w-12 h-12 rounded-lg object-cover'
                  }),
                  React.createElement('div', null,
                    React.createElement('h3', { className: 'font-semibold' }, veg.name),
                    React.createElement('p', { className: 'text-gray-600 text-sm' }, veg.hindi)
                  )
                ),
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Price per kg / प्रति किलो कीमत'),
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('span', { className: 'text-lg' }, '₹'),
                    React.createElement('input', {
                      type: 'number',
                      min: '0',
                      step: '0.5',
                      value: veg.pricePerKg,
                      onChange: (e) => handlePriceChange(veg.id, e.target.value),
                      className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold'
                    })
                  )
                )
              )
            ))
          )
        ),

        // Instructions
        React.createElement('div', { className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' },
          React.createElement('h3', { className: 'font-semibold text-yellow-800 mb-2' }, 'Instructions / निर्देश'),
          React.createElement('ul', { className: 'text-sm text-yellow-700 space-y-1' },
            React.createElement('li', null, '• Edit prices directly or upload a CSV file'),
            React.createElement('li', null, '• CSV format: id,price (e.g., tomato,45)'),
            React.createElement('li', null, '• Click "Save All" to update prices'),
            React.createElement('li', null, '• Changes are saved locally and applied immediately'),
            React.createElement('li', null, '• प्राइस सीधे एडिट करें या CSV फाइल अपलोड करें')
          )
        )
      )
    )
  )
}
