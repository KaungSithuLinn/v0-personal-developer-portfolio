"use client"

import { useEffect, useState } from "react"

export function LocationGreeting() {
  const [city, setCity] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/location")
      .then((response) => response.json())
      .then((data: { city?: string }) => {
        if (active) setCity(data.city || "")
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  if (!city) return null

  return (
    <p className="text-center text-sm text-muted-foreground py-4">
      Hello from {city}!
    </p>
  )
}
