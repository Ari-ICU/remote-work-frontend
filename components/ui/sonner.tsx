'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-md group-[.toaster]:bg-opacity-80",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-emerald-500/50 group-[.toaster]:bg-emerald-500/10 group-[.toaster]:text-emerald-500",
          error: "group-[.toaster]:border-destructive/50 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive",
          info: "group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-blue-500",
          warning: "group-[.toaster]:border-amber-500/50 group-[.toaster]:bg-amber-500/10 group-[.toaster]:text-amber-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

