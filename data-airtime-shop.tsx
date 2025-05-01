"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFlutterwave } from "@/hooks/use-flutterwave"

const dataPlans = [
  {
    network: "MTN SME",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/MTN_Logo.svg",
    plans: [
      { size: "1GB", price: 800 },
      { size: "2GB", price: 1600 },
      { size: "3GB", price: 2400 },
      { size: "5GB", price: 4000 },
    ],
  },
  {
    network: "MTN GIFTING",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/MTN_Logo.svg",
    plans: [
      { size: "1GB", price: 550 },
      { size: "1.2GB", price: 800 },
      { size: "2GB", price: 1000 },
      { size: "3.2GB", price: 1500 },
      { size: "6GB", price: 3000 },
      { size: "16.5GB", price: 7200 },
      { size: "20GB", price: 10000 },
    ],
  },
  {
    network: "MTN COOPERATE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/MTN_Logo.svg",
    plans: [
      { size: "2GB", price: 1500 },
      { size: "3GB", price: 2250 },
      { size: "5GB", price: 3500 },
    ],
  },
  {
    network: "AIRTEL SME",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Airtel_logo_2020.svg",
    plans: [
      { size: "150MB", price: 100 },
      { size: "3GB", price: 1500 },
      { size: "7GB", price: 3000 },
      { size: "10GB", price: 4500 },
    ],
  },
  {
    network: "AIRTEL GIFTING",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Airtel_logo_2020.svg",
    plans: [
      { size: "500MB", price: 600 },
      { size: "1GB", price: 900 },
      { size: "2GB", price: 1800 },
      { size: "3GB", price: 2600 },
      { size: "4GB", price: 3200 },
      { size: "8GB", price: 4000 },
      { size: "10GB", price: 5000 },
      { size: "13GB", price: 6200 },
    ],
  },
  {
    network: "AIRTEL COOPERATE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Airtel_logo_2020.svg",
    plans: [
      { size: "500MB", price: 580 },
      { size: "1GB", price: 1000 },
      { size: "2GB", price: 2000 },
      { size: "3GB", price: 3000 },
      { size: "4GB", price: 4000 },
    ],
  },
  {
    network: "GLO SME",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Glo_Logo.png",
    plans: [
      { size: "1.5GB", price: 400 },
      { size: "2.5GB", price: 650 },
      { size: "10GB", price: 2500 },
    ],
  },
  {
    network: "GLO COOPERATE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Glo_Logo.png",
    plans: [
      { size: "500MB", price: 250 },
      { size: "1GB", price: 500 },
      { size: "2GB", price: 880 },
      { size: "3GB", price: 1400 },
      { size: "5GB", price: 2500 },
    ],
  },
  {
    network: "9MOBILE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/9mobile_logo.png",
    plans: [
      { size: "500MB", price: 180 },
      { size: "1GB", price: 360 },
      { size: "2GB", price: 720 },
      { size: "3GB", price: 1080 },
    ],
  },
]

// Group data plans by provider type
const groupedDataPlans = {
  mtn: dataPlans.filter((plan) => plan.network.includes("MTN")),
  airtel: dataPlans.filter((plan) => plan.network.includes("AIRTEL")),
  glo: dataPlans.filter((plan) => plan.network.includes("GLO")),
  mobile9: dataPlans.filter((plan) => plan.network.includes("9MOBILE")),
}

export default function DataAirtimeShop() {
  const [greeting, setGreeting] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [airtimeAmount, setAirtimeAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("data")
  const [selectedProvider, setSelectedProvider] = useState("mtn")
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const { isFlutterwaveReady, initializePayment } = useFlutterwave()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const validatePhoneNumber = (number: string) => {
    // Basic Nigerian phone number validation
    const phoneRegex = /^(0[789][01]\d{8})$/
    if (!number) {
      setPhoneError("Phone number is required")
      return false
    } else if (!phoneRegex.test(number)) {
      setPhoneError("Please enter a valid Nigerian phone number")
      return false
    }
    setPhoneError("")
    return true
  }

  const handlePayment = (amount: number, description: string) => {
    if (!validatePhoneNumber(phoneNumber)) {
      return
    }

    if (!isFlutterwaveReady) {
      setPaymentStatus({
        type: "error",
        message: "Payment system is not ready yet. Please try again.",
      })
      return
    }

    setIsProcessing(true)
    setPaymentStatus({ type: null, message: "" })

    initializePayment({
      public_key: "FLWPUBK_TEST-8d04e67c2be0f9d273f073be2ce40c25-X",
      tx_ref: "txn-" + Date.now(),
      amount: amount,
      currency: "NGN",
      payment_options: "card,ussd,banktransfer",
      customer: {
        email: "customer@example.com",
        phonenumber: phoneNumber,
        name: "QuickTopUp User",
      },
      customizations: {
        title: "QuickTopUp",
        description: description,
        logo: "https://your-logo-url.com/logo.png",
      },
      callback: (response) => {
        setIsProcessing(false)
        if (response.status === "successful") {
          setPaymentStatus({
            type: "success",
            message: `Payment successful! Transaction ID: ${response.transaction_id}`,
          })
        } else {
          setPaymentStatus({
            type: "error",
            message: "Payment failed or was cancelled.",
          })
        }
      },
      onclose: () => {
        setIsProcessing(false)
      },
    })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneNumber(value)
    if (value) validatePhoneNumber(value)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-800">
          {greeting}! Welcome to QuickTopUp
        </h1>

        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <Label htmlFor="phone" className="text-sm font-medium">
            Enter Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="e.g. 08012345678"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={phoneError ? "border-red-500" : ""}
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        {paymentStatus.type && (
          <Alert
            className={`mb-4 ${
              paymentStatus.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{paymentStatus.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="data" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data">Buy Data</TabsTrigger>
            <TabsTrigger value="airtime">Buy Airtime</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="mt-4">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedProvider === "mtn" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvider("mtn")}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/MTN_Logo.svg"
                    alt="MTN"
                    className="h-4"
                  />
                  MTN
                </Button>
                <Button
                  variant={selectedProvider === "airtel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvider("airtel")}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/87/Airtel_logo_2020.svg"
                    alt="Airtel"
                    className="h-4"
                  />
                  Airtel
                </Button>
                <Button
                  variant={selectedProvider === "glo" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvider("glo")}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/13/Glo_Logo.png"
                    alt="Glo"
                    className="h-4"
                  />
                  Glo
                </Button>
                <Button
                  variant={selectedProvider === "mobile9" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvider("mobile9")}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/9mobile_logo.png"
                    alt="9Mobile"
                    className="h-4"
                  />
                  9Mobile
                </Button>
              </div>

              <p className="text-center mb-4 text-sm text-gray-600">All data plans are valid for 30 days</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedDataPlans[selectedProvider as keyof typeof groupedDataPlans].map((group, idx) => (
                  <Card key={idx} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={group.logo || "/placeholder.svg"} alt={group.network} className="h-5" />
                        <h2 className="text-lg font-semibold">{group.network}</h2>
                      </div>
                      <ul className="space-y-2">
                        {group.plans.map((plan, i) => (
                          <li
                            key={i}
                            className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0"
                          >
                            <span className="text-sm">
                              {plan.size} - ₦{plan.price.toLocaleString()}
                            </span>
                            <Button
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => handlePayment(plan.price, `${group.network} - ${plan.size}`)}
                              className="h-8"
                            >
                              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy"}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="airtime" className="mt-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Buy Airtime</h2>
                <div className="mb-4">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Enter Airtime Amount (₦)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g. 1000"
                    value={airtimeAmount}
                    onChange={(e) => setAirtimeAmount(e.target.value)}
                    min="50"
                    max="50000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Min: ₦50, Max: ₦50,000</p>
                </div>
                <Button
                  className="w-full"
                  disabled={isProcessing || !airtimeAmount || Number(airtimeAmount) < 50}
                  onClick={() => handlePayment(Number(airtimeAmount), `Airtime - ₦${airtimeAmount}`)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
