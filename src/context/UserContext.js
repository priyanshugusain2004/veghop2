import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  // users: { [username]: { name, cart: [ { id, vegId, name, hindi, pricePerKg, qtyKg, subtotal } ] } }
  const [users, setUsers] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [vegetables, setVegetables] = useState([])

  // Load vegetables data on mount
  useEffect(() => {
    loadVegetables()
  }, [])

  async function loadVegetables() {
    try {
      // First try to load from localStorage (for admin updates)
      const savedPrices = localStorage.getItem('vegetablePrices')
      if (savedPrices) {
        setVegetables(JSON.parse(savedPrices))
        return
      }

      // Fall back to default JSON file
      const response = await fetch('/src/data/vegetables.json')
      const data = await response.json()
      setVegetables(data)
    } catch (error) {
      console.error('Error loading vegetables:', error)
    }
  }

  function createOrSelectUser(name) {
    setUsers(prev => {
      if (prev[name]) return prev
      return { ...prev, [name]: { name, cart: [] } }
    })
    setCurrentUser(name)
  }

  function addToCart(item) {
    setUsers(prev => {
      const user = prev[currentUser] || { name: currentUser, cart: [] }
      const newCart = [...user.cart, item]
      return { ...prev, [currentUser]: { ...user, cart: newCart } }
    })
  }

  function clearCart() {
    setUsers(prev => ({ ...prev, [currentUser]: { ...prev[currentUser], cart: [] } }))
  }

  return (
    React.createElement(UserContext.Provider, { value: { users, currentUser, setCurrentUser, createOrSelectUser, addToCart, clearCart, vegetables, loadVegetables } }, children)
  )
}

export function useUser() { return useContext(UserContext) }
