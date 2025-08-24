import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

// Currency helpers
let cachedFx = { timestamp: 0, base: 'THB', symbolsKey: '', rates: {} }
const HEROKU_BASE = 'https://kunpitch-backend-new-b63bd38838f8.herokuapp.com'
const LOCAL_BASE = 'http://localhost:1991'

export async function getFxRates(base = 'THB', symbols = 'USD,EUR,JPY,GBP') {
  const now = Date.now()
  const tenMinutes = 10 * 60 * 1000
  // Normalize symbols to a stable cache key (case-insensitive, sorted)
  const symbolsKey = String(symbols)
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(Boolean)
    .sort()
    .join(',')

  if (
    cachedFx.base === base &&
    cachedFx.symbolsKey === symbolsKey &&
    now - cachedFx.timestamp < tenMinutes &&
    Object.keys(cachedFx.rates).length
  ) {
    return cachedFx
  }
  // try multiple bases: env → heroku → localhost
  const candidates = []
  if (import.meta.env && import.meta.env.VITE_API_BASE) candidates.push(import.meta.env.VITE_API_BASE)
  candidates.push(HEROKU_BASE)
  candidates.push(LOCAL_BASE)

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/api/fx/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbolsKey)}`)
      const data = await res.json()
      if (data && data.success) {
        cachedFx = { timestamp: now, base: data.base, symbolsKey, rates: data.rates }
        break
      }
    } catch (e) {
      console.warn('FX fetch failed', baseUrl, e)
      continue
    }
  }
  return cachedFx
}

export function formatCurrency(value, currency = 'THB', locale = 'th-TH') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
  } catch {
    return `${value}`
  }
}