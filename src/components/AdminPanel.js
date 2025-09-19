import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0'

export default function AdminPanel({ onBack }) {
  const [vegetables, setVegetables] = useState([])
  const [editedVegetables, setEditedVegetables] = useState([])
  const [saveStatus, setSaveStatus] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    hindi: '',
    pricePerKg: '',
    category: 'vegetable',
    image: ''
  })

  // Translation dictionary for common vegetables and fruits
  const translations = {
    // Vegetables
    'tomato': 'टमाटर',
    'potato': 'आलू',
    'onion': 'प्याज़',
    'carrot': 'गाजर',
    'capsicum': 'शिमला मिर्च',
    'cabbage': 'पत्ता गोभी',
    'cauliflower': 'फूल गोभी',
    'brinjal': 'बैंगन',
    'eggplant': 'बैंगन',
    'okra': 'भिंडी',
    'spinach': 'पालक',
    'peas': 'मटर',
    'green peas': 'हरी मटर',
    'cucumber': 'खीरा',
    'radish': 'मूली',
    'beetroot': 'चुकंदर',
    'turnip': 'शलगम',
    'ginger': 'अदरक',
    'garlic': 'लहसुन',
    'green chili': 'हरी मिर्च',
    'coriander': 'धनिया',
    'mint': 'पुदीना',
    'fenugreek': 'मेथी',
    'bottle gourd': 'लौकी',
    'bitter gourd': 'करेला',
    'ridge gourd': 'तोरी',
    'pumpkin': 'कद्दू',
    'sweet potato': 'शकरकंद',
    'mushroom': 'मशरूम',
    'corn': 'मक्का',
    'lettuce': 'सलाद पत्ता',
    
    // Fruits
    'apple': 'सेब',
    'banana': 'केला',
    'orange': 'संतरा',
    'mango': 'आम',
    'grapes': 'अंगूर',
    'papaya': 'पपीता',
    'watermelon': 'तरबूज़',
    'pineapple': 'अनानास',
    'pomegranate': 'अनार',
    'guava': 'अमरूद',
    'lemon': 'नींबू',
    'lime': 'नींबू',
    'coconut': 'नारियल',
    'dates': 'खजूर',
    'fig': 'अंजीर',
    'kiwi': 'कीवी',
    'strawberry': 'स्ट्रॉबेरी',
    'cherry': 'चेरी',
    'peach': 'आड़ू',
    'plum': 'आलूबुखारा',
    'lychee': 'लीची',
    'jackfruit': 'कटहल',
    'custard apple': 'सीताफल',
    'dragon fruit': 'ड्रैगन फ्रूट'
  }

  // Function to auto-translate English name to Hindi
  function autoTranslate(englishName) {
    const lowerName = englishName.toLowerCase().trim()
    return translations[lowerName] || ''
  }

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
    const csvContent = "id,name,hindi,price,category\n" + 
      editedVegetables.map(veg => 
        `${veg.id},${veg.name},${veg.hindi},${veg.pricePerKg},${veg.category || 'vegetable'}`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vegetable-prices-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  function handleAddNew() {
    if (!newItem.name || !newItem.hindi || !newItem.pricePerKg) {
      setSaveStatus('❌ Please fill all required fields')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    // Generate ID from name if not provided
    const id = newItem.id || newItem.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    
    // Check if ID already exists
    if (editedVegetables.some(item => item.id === id)) {
      setSaveStatus('❌ Item with this ID already exists')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    // Default image based on category
    const defaultImage = newItem.category === 'fruit' 
      ? "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3"
      : "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3"

    const newVegetable = {
      ...newItem,
      id,
      pricePerKg: parseFloat(newItem.pricePerKg) || 0,
      image: newItem.image || defaultImage
    }

    setEditedVegetables(prev => [...prev, newVegetable])
    setNewItem({
      id: '',
      name: '',
      hindi: '',
      pricePerKg: '',
      category: 'vegetable',
      image: ''
    })
    setShowAddForm(false)
    setSaveStatus('✅ New item added! Remember to click "Save All"')
    setTimeout(() => setSaveStatus(''), 5000)
  }

  function handleDeleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
      setEditedVegetables(prev => prev.filter(item => item.id !== id))
      setSaveStatus('✅ Item deleted! Remember to click "Save All"')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  return (
    React.createElement('div', { className: 'min-h-screen bg-gray-50 p-2 sm:p-4' },
      React.createElement('div', { className: 'max-w-4xl mx-auto' },
        // Header
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4' },
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-xl sm:text-2xl font-bold text-gray-800' }, 'Admin Panel / एडमिन पैनल'),
              React.createElement('p', { className: 'text-sm sm:text-base text-gray-600' }, 'Update daily vegetable prices / दैनिक सब्जी दरें अपडेट करें')
            ),
            React.createElement('button', {
              onClick: onBack,
              className: 'w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors'
            }, '← Back / वापस')
          )
        ),

        // CSV Upload Section
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('h2', { className: 'text-lg sm:text-xl font-semibold mb-3 sm:mb-4' }, 'Bulk Update / बल्क अपडेट'),
          React.createElement('div', { className: 'flex flex-col gap-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Upload CSV / CSV अपलोड करें'),
              React.createElement('input', {
                type: 'file',
                accept: '.csv',
                onChange: handleCSVUpload,
                className: 'block w-full text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              }),
              React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, 'Format: id,price (e.g., tomato,45)')
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Download Current / वर्तमान डाउनलोड करें'),
              React.createElement('button', {
                onClick: downloadCurrentPrices,
                className: 'w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors'
              }, '📥 Download CSV')
            )
          )
        ),

        // Add New Item Section
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4' },
            React.createElement('h2', { className: 'text-lg sm:text-xl font-semibold' }, 'Add New Item / नया आइटम जोड़ें'),
            React.createElement('button', {
              onClick: () => setShowAddForm(!showAddForm),
              className: 'w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors'
            }, showAddForm ? '✕ Cancel' : '➕ Add New')
          ),

          showAddForm && React.createElement('div', { className: 'mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg' },
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Name (English) *'),
                React.createElement('input', {
                  type: 'text',
                  value: newItem.name,
                  onChange: e => {
                    const englishName = e.target.value
                    const hindiTranslation = autoTranslate(englishName)
                    setNewItem(prev => ({ 
                      ...prev, 
                      name: englishName,
                      hindi: hindiTranslation || prev.hindi // Keep existing Hindi if no translation found
                    }))
                  },
                  placeholder: 'e.g., Spinach',
                  className: 'w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                }),
                React.createElement('p', { className: 'text-xs text-blue-600 mt-1' }, '✨ Hindi name will auto-fill for common vegetables')
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Name (Hindi) *'),
                React.createElement('input', {
                  type: 'text',
                  value: newItem.hindi,
                  onChange: e => setNewItem(prev => ({ ...prev, hindi: e.target.value })),
                  placeholder: 'e.g., पालक',
                  className: 'w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Price per kg (₹) *'),
                React.createElement('input', {
                  type: 'number',
                  min: '0',
                  step: '0.5',
                  value: newItem.pricePerKg,
                  onChange: e => setNewItem(prev => ({ ...prev, pricePerKg: e.target.value })),
                  placeholder: 'e.g., 40',
                  className: 'w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Category'),
                React.createElement('select', {
                  value: newItem.category,
                  onChange: e => setNewItem(prev => ({ ...prev, category: e.target.value })),
                  className: 'w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                },
                  React.createElement('option', { value: 'vegetable' }, '🥬 Vegetable / सब्जी'),
                  React.createElement('option', { value: 'fruit' }, '🍎 Fruit / फल')
                )
              ),
              React.createElement('div', { className: 'sm:col-span-2' },
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Image URL (optional)'),
                React.createElement('input', {
                  type: 'url',
                  value: newItem.image,
                  onChange: e => setNewItem(prev => ({ ...prev, image: e.target.value })),
                  placeholder: 'https://images.unsplash.com/...',
                  className: 'w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                }),
                React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, 'Leave empty for default image')
              )
            ),
            React.createElement('div', { className: 'mt-4 flex flex-col sm:flex-row gap-3' },
              React.createElement('button', {
                onClick: handleAddNew,
                className: 'w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors'
              }, '✅ Add Item'),
              React.createElement('button', {
                onClick: () => setShowAddForm(false),
                className: 'w-full sm:w-auto px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors'
              }, 'Cancel')
            )
          )
        ),

        // Price Editing
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4' },
            React.createElement('h2', { className: 'text-lg sm:text-xl font-semibold' }, `Manage Items (${editedVegetables.length}) / आइटम प्रबंधित करें`),
            React.createElement('button', {
              onClick: handleSave,
              className: 'w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors'
            }, '💾 Save All / सभी सेव करें')
          ),

          saveStatus && React.createElement('div', { className: 'mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-center font-medium text-sm sm:text-base' }, saveStatus),

          React.createElement('div', { className: 'grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
            editedVegetables.map(veg => (
              React.createElement('div', { 
                key: veg.id, 
                className: `border rounded-lg p-3 sm:p-4 ${veg.category === 'fruit' ? 'border-l-4 border-orange-400' : 'border-l-4 border-green-400'}`
              },
                React.createElement('div', { className: 'flex items-start gap-3 mb-3' },
                  React.createElement('img', { 
                    src: veg.image, 
                    alt: veg.name,
                    className: 'w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0'
                  }),
                  React.createElement('div', { className: 'flex-1 min-w-0' },
                    React.createElement('div', { className: 'flex items-start justify-between gap-2 mb-1' },
                      React.createElement('div', { className: 'flex items-center gap-2 min-w-0' },
                        React.createElement('span', { className: 'text-base sm:text-lg flex-shrink-0' }, veg.category === 'fruit' ? '🍎' : '🥬'),
                        React.createElement('h3', { className: 'font-semibold text-sm sm:text-base truncate' }, veg.name)
                      ),
                      React.createElement('button', {
                        onClick: () => handleDeleteItem(veg.id),
                        className: 'text-red-500 hover:text-red-700 text-lg sm:text-xl flex-shrink-0 p-1',
                        title: 'Delete item'
                      }, '🗑️')
                    ),
                    React.createElement('p', { className: 'text-gray-600 text-xs sm:text-sm truncate' }, veg.hindi),
                    React.createElement('p', { className: 'text-xs text-gray-500 truncate' }, `ID: ${veg.id}`)
                  )
                ),
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-xs sm:text-sm font-medium text-gray-700' }, 'Price per kg / प्रति किलो कीमत'),
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('span', { className: 'text-base sm:text-lg font-medium flex-shrink-0' }, '₹'),
                    React.createElement('input', {
                      type: 'number',
                      min: '0',
                      step: '0.5',
                      value: veg.pricePerKg,
                      onChange: (e) => handlePriceChange(veg.id, e.target.value),
                      className: 'flex-1 px-2 sm:px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold transition-colors'
                    })
                  )
                )
              )
            ))
          )
        ),

        // Instructions
        React.createElement('div', { className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4' },
          React.createElement('h3', { className: 'font-semibold text-yellow-800 mb-2 text-sm sm:text-base' }, 'Instructions / निर्देश'),
          React.createElement('ul', { className: 'text-xs sm:text-sm text-yellow-700 space-y-1' },
            React.createElement('li', null, '• Click "Add New" to add vegetables/fruits'),
            React.createElement('li', null, '• Edit prices directly or upload a CSV file'),
            React.createElement('li', null, '• CSV format: id,name,hindi,price,category'),
            React.createElement('li', null, '• Click 🗑️ to delete items'),
            React.createElement('li', null, '• Click "Save All" to update all changes'),
            React.createElement('li', null, '• Changes are saved locally and applied immediately'),
            React.createElement('li', null, '• नया आइटम जोड़ने के लिए "Add New" पर क्लिक करें')
          )
        )
      )
    )
  )
}
