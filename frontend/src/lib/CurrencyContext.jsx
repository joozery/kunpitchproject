import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getFxRates, formatCurrency } from './utils'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [base] = useState('THB')
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'THB')
  const [rates, setRates] = useState({})

  useEffect(() => {
    localStorage.setItem('currency', currency)
    ;(async () => {
      const fx = await getFxRates(base, `${currency}`)
      setRates(fx.rates || {})
    })()
  }, [currency, base])

  const convert = (amountTHB) => {
    if (currency === base) return amountTHB
    const rate = rates[currency]
    if (!rate) return amountTHB
    return amountTHB * rate
  }

  const format = (value) => formatCurrency(value, currency, currency === 'THB' ? 'th-TH' : 'en-US')

  const value = useMemo(() => ({ currency, setCurrency, convert, format, base }), [currency, rates])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}

