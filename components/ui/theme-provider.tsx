"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = {
  color: string
  radius: string
  mode: "light" | "dark"
}

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialTheme: Theme = {
  color: "zinc",
  radius: "0.5",
  mode: "light",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const colors = {
  zinc: {
    light: {
      primary: "240 5.9% 10%",
      primaryForeground: "0 0% 98%",
    },
    dark: {
      primary: "0 0% 98%",
      primaryForeground: "240 5.9% 10%",
    },
  },
  red: {
    light: {
      primary: "0 84.2% 60.2%",
      primaryForeground: "0 0% 98%",
    },
    dark: {
      primary: "0 84.2% 60.2%",
      primaryForeground: "0 0% 98%",
    },
  },
  rose: {
    light: {
      primary: "346.8 77.2% 49.8%",
      primaryForeground: "355 100% 97.3%",
    },
    dark: {
      primary: "346.8 77.2% 49.8%",
      primaryForeground: "355 100% 97.3%",
    },
  },
  orange: {
    light: {
      primary: "24.6 95% 53.1%",
      primaryForeground: "60 9.1% 97.8%",
    },
    dark: {
      primary: "20.5 90.2% 48.2%",
      primaryForeground: "60 9.1% 97.8%",
    },
  },
  green: {
    light: {
      primary: "142.1 76.2% 36.3%",
      primaryForeground: "355 100% 97.3%",
    },
    dark: {
      primary: "142.1 70.6% 45.3%",
      primaryForeground: "144.9 80.4% 10%",
    },
  },
  blue: {
    light: {
      primary: "221.2 83.2% 53.3%",
      primaryForeground: "210 40% 98%",
    },
    dark: {
      primary: "217.2 91.2% 59.8%",
      primaryForeground: "222.2 47.4% 11.2%",
    },
  },
  yellow: {
    light: {
      primary: "47.9 95.8% 53.1%",
      primaryForeground: "26 83.3% 14.1%",
    },
    dark: {
      primary: "47.9 95.8% 53.1%",
      primaryForeground: "26 83.3% 14.1%",
    },
  },
  violet: {
    light: {
      primary: "262.1 83.3% 57.8%",
      primaryForeground: "210 40% 98%",
    },
    dark: {
      primary: "263.4 70% 50.4%",
      primaryForeground: "210 40% 98%",
    },
  },
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      return savedTheme ? JSON.parse(savedTheme) : initialTheme
    }
    return initialTheme
  })

  useEffect(() => {
    // Update CSS variables when theme changes
    const root = document.documentElement
    const colorValues = colors[theme.color as keyof typeof colors][theme.mode]

    root.style.setProperty("--primary", colorValues.primary)
    root.style.setProperty("--primary-foreground", colorValues.primaryForeground)
    root.style.setProperty("--radius", `${theme.radius}rem`)

    if (theme.mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Save theme to localStorage
    localStorage.setItem("theme", JSON.stringify(theme))
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

