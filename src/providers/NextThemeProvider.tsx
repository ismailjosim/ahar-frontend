"use client"

import { ThemeProvider } from "next-themes"

const NextThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

export default NextThemeProvider
