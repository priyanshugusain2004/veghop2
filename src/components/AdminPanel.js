import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0'
import { clearAllCachesAndReload } from '../utils/cacheHelpers.js'

export default function AdminPanel({ onBack }) {
  const [userData, setUserData] = useState([])
  const [userStatus, setUserStatus] = useState('')
  const [dateFilter, setDateFilter] = useState('')

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
    loadUserData()
  }, [])

  function loadUserData(date = '') {
    try {
      let data = JSON.parse(localStorage.getItem('veghop:purchases') || '[]')
      if (date) {
        data = data.filter(u => u.date && u.date.startsWith(date))
      }
      setUserData(data)
    } catch (error) {
      setUserStatus('❌ Error loading user data')
      setTimeout(() => setUserStatus(''), 3000)
    }
  }

  function handleDateFilterChange(e) {
    setDateFilter(e.target.value)
    loadUserData(e.target.value)
  }

    function downloadUserDataCSV() {
      if (!userData.length) return
      const csvContent = 'date,userName,item,hindi,qtyKg,pricePerKg,subtotal,total\n' +
        userData.map(u =>
          u.items.map(i =>
            `${u.date},${u.userName},${i.name},${i.hindi},${i.qtyKg},${i.pricePerKg},${i.subtotal},${u.total}`
          ).join('\n')
        ).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }

  // Group purchases by user
  const userGroups = {}
  userData.forEach(p => {
    if (!userGroups[p.userName]) userGroups[p.userName] = []
    userGroups[p.userName].push(p)
  })

  function downloadUserDetailsCSV() {
    const rows = [['User Name', 'Date & Time', 'Item', 'Hindi', 'Qty (kg)', 'Price/kg', 'Subtotal', 'Total']]
    Object.entries(userGroups).forEach(([user, purchases]) => {
      purchases.forEach(p => {
        p.items.forEach(i => {
          rows.push([user, p.date, i.name, i.hindi, i.qtyKg, i.pricePerKg, i.subtotal, p.total])
        })
      })
    })
    const csvContent = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-details-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to Excel (.xlsx) using xlsx CDN
  function downloadUserDetailsExcel() {
    if (!window.XLSX) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
      script.onload = () => downloadUserDetailsExcel()
      document.body.appendChild(script)
      return
    }
    const rows = [['User Name', 'Date & Time', 'Item', 'Hindi', 'Qty (kg)', 'Price/kg', 'Subtotal', 'Total']]
    Object.entries(userGroups).forEach(([user, purchases]) => {
      purchases.forEach(p => {
        p.items.forEach(i => {
          rows.push([user, p.date, i.name, i.hindi, i.qtyKg, i.pricePerKg, i.subtotal, p.total])
        })
      })
    })
    const ws = window.XLSX.utils.aoa_to_sheet(rows)
    const wb = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(wb, ws, 'UserDetails')
    window.XLSX.writeFile(wb, `user-details-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    React.createElement('div', { className: 'min-h-screen bg-gray-50 p-2 sm:p-4' },
      React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4' },
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-xl sm:text-2xl font-bold text-gray-800' }, 'Admin Panel / एडमिन पैनल'),
              React.createElement('p', { className: 'text-sm sm:text-base text-gray-600' }, 'View user checkout data / उपयोगकर्ता डेटा देखें')
            ),
            React.createElement('button', {
              onClick: onBack,
              className: 'w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors'
            }, '← Back / वापस')
          )
        ),
        // User Details Section
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('h2', { className: 'text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700' }, 'User Details / उपयोगकर्ता विवरण'),
          React.createElement('div', { className: 'flex gap-2 mb-4' },
            React.createElement('button', {
              onClick: downloadUserDetailsCSV,
              className: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors'
            }, '⬇️ Download CSV'),
            React.createElement('button', {
              onClick: downloadUserDetailsExcel,
              className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors'
            }, '⬇️ Export to Excel')
          ),
          Object.keys(userGroups).length === 0 ? (
            React.createElement('div', { className: 'text-center p-6 text-lg text-red-600 font-semibold' }, 'No user details found. Once a user completes a purchase, their details will appear here.')
          ) : (
            Object.entries(userGroups).map(([user, purchases]) => (
              React.createElement('div', { key: user, className: 'mb-6' },
                React.createElement('h3', { className: 'text-lg font-bold mb-2 text-blue-800' }, user),
                purchases.map((p, idx) => (
                  React.createElement('div', { key: idx, className: 'mb-2 p-2 border rounded-lg bg-gray-50' },
                    React.createElement('div', { className: 'font-medium' }, `Date: ${p.date}`),
                    React.createElement('ul', { className: 'list-disc pl-4' },
                      p.items.map((i, idx2) => (
                        React.createElement('li', { key: idx2 }, `${i.name} (${i.hindi}) — ${i.qtyKg}kg × ₹${i.pricePerKg} = ₹${i.subtotal}`)
                      ))
                    ),
                    React.createElement('div', { className: 'font-semibold text-indigo-700' }, `Total: ₹${p.total}`)
                  )
                ))
              )
            ))
          )
        ),
        // Purchase Records Section (existing)
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6' },
          React.createElement('h2', { className: 'text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-700' }, 'User Purchase Records / उपयोगकर्ता खरीद रिकॉर्ड'),
          React.createElement('div', { className: 'flex flex-col sm:flex-row gap-4 mb-4' },
            React.createElement('input', {
              type: 'date',
              value: dateFilter,
              onChange: handleDateFilterChange,
              className: 'px-3 py-2 border rounded-lg text-base'
            }),
            React.createElement('button', {
              onClick: downloadUserDataCSV,
              className: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors'
            }, '📥 Export CSV')
          ),
          userStatus && React.createElement('div', { className: 'mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-center font-medium text-sm sm:text-base' }, userStatus),
          React.createElement('div', { className: 'overflow-x-auto' },
            React.createElement('table', { className: 'min-w-full text-sm border' },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', { className: 'border px-2 py-1' }, 'Date & Time'),
                  React.createElement('th', { className: 'border px-2 py-1' }, 'User'),
                  React.createElement('th', { className: 'border px-2 py-1' }, 'Items Bought'),
                  React.createElement('th', { className: 'border px-2 py-1' }, 'Total (₹)')
                )
              ),
              React.createElement('tbody', null,
                userData.length === 0 ? (
                  React.createElement('tr', null,
                    React.createElement('td', { colSpan: 4, className: 'text-center p-6 text-lg text-red-600 font-semibold' }, 'No user purchase records found. Once a user completes a purchase, their details will appear here.')
                  )
                ) : (
                  userData.map((u, idx) => (
                    React.createElement('tr', { key: idx },
                      React.createElement('td', { className: 'border px-2 py-1' }, u.date),
                      React.createElement('td', { className: 'border px-2 py-1' }, u.userName),
                      React.createElement('td', { className: 'border px-2 py-1' },
                        React.createElement('ul', { className: 'list-disc pl-4' },
                          u.items.map((i, idx2) => (
                            React.createElement('li', { key: idx2 },
                              `${i.name} (${i.hindi}) — ${i.qtyKg}kg × ₹${i.pricePerKg} = ₹${i.subtotal}`
                            )
                          ))
                        )
                      ),
                      React.createElement('td', { className: 'border px-2 py-1' }, u.total)
                    )
                  ))
                )
              )
            )
          )
        )
      )
  )
}
