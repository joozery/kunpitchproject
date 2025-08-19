import React, { createContext, useContext, useEffect, useState } from 'react'
import { getBannerSettings } from '../lib/bannerApi'

const BannerContext = createContext()

export const useBanner = () => {
  const context = useContext(BannerContext)
  if (!context) {
    throw new Error('useBanner must be used within a BannerProvider')
  }
  return context
}

export const BannerProvider = ({ children }) => {
  const [bannerData, setBannerData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load banner data on mount
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getBannerSettings()
        setBannerData(data)
      } catch (err) {
        console.error('Error loading banner data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadBannerData()
  }, [])

  // Refresh banner data
  const refreshBannerData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getBannerSettings()
      setBannerData(data)
    } catch (err) {
      console.error('Error refreshing banner data:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Update banner data locally (for immediate UI updates)
  const updateBannerData = (newData) => {
    setBannerData(prev => ({
      ...prev,
      ...newData
    }))
  }

  const value = {
    bannerData,
    isLoading,
    error,
    refreshBannerData,
    updateBannerData
  }

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  )
}

export default BannerContext 