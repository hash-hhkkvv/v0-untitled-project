"use client"

import { useEffect, useState } from "react"

type FlutterwaveConfig = {
  public_key: string
  tx_ref: string
  amount: number
  currency: string
  payment_options: string
  customer: {
    email: string
    phonenumber: string
    name: string
  }
  customizations: {
    title: string
    description: string
    logo: string
  }
  callback: (response: any) => void
  onclose: () => void
}

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: FlutterwaveConfig) => void
  }
}

export function useFlutterwave() {
  const [isFlutterwaveReady, setIsFlutterwaveReady] = useState(false)

  useEffect(() => {
    // Check if Flutterwave script is already loaded
    if (window.FlutterwaveCheckout) {
      setIsFlutterwaveReady(true)
      return
    }

    // Load Flutterwave script
    const script = document.createElement("script")
    script.src = "https://checkout.flutterwave.com/v3.js"
    script.async = true
    script.onload = () => setIsFlutterwaveReady(true)
    script.onerror = () => {
      console.error("Failed to load Flutterwave script")
    }

    document.body.appendChild(script)

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const initializePayment = (config: FlutterwaveConfig) => {
    if (window.FlutterwaveCheckout) {
      window.FlutterwaveCheckout(config)
    } else {
      console.error("Flutterwave not loaded")
    }
  }

  return { isFlutterwaveReady, initializePayment }
}
