"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => null
})

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const root = document.documentElement
    const initialTheme = root.dataset.theme as Theme || 'light'
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  const updateTheme = (newTheme: Theme) => {
    const root = document.documentElement
    root.dataset.theme = newTheme
    localStorage.setItem('theme', newTheme)
    
    // Update classList for Tailwind
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    setTheme(newTheme)
  }

  // Prevent any flickering during hydration
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)