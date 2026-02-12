import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AiChatBot } from "@/components/ai-chat-bot"
import './globals.css'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://khmerwork.com'),
  title: {
    default: 'KhmerWork - Find Remote & Freelance Jobs in Cambodia',
    template: '%s | KhmerWork'
  },
  description: 'The leading platform for freelance and remote job opportunities in Cambodia. Connect with top employers and talented professionals.',
  keywords: ['freelance', 'remote work', 'cambodia', 'jobs', 'hiring', 'developers', 'designers', 'khmer work'],
  authors: [{ name: 'KhmerWork Team' }],
  creator: 'KhmerWork',
  publisher: 'KhmerWork',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'KhmerWork - Find Remote & Freelance Jobs in Cambodia',
    description: 'The leading platform for freelance and remote job opportunities in Cambodia. Connect with top employers and talented professionals.',
    url: 'https://khmerwork.com',
    siteName: 'KhmerWork',
    images: [
      {
        url: '/placeholder.jpg',
        width: 1200,
        height: 630,
        alt: 'KhmerWork Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KhmerWork - Find Remote & Freelance Jobs in Cambodia',
    description: 'The leading platform for freelance and remote job opportunities in Cambodia.',
    images: ['/placeholder.jpg'],
    creator: '@khmerwork',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
  manifest: '/site.webmanifest',
}

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider"
import { getUserLocale } from "@/lib/locale"
import { Toaster } from 'sonner'
import { LoadingProvider } from "@/components/providers/loading-provider"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getUserLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "KhmerWork",
              "url": "https://khmerwork.com",
              "logo": "https://khmerwork.com/placeholder-logo.svg",
              "sameAs": [
                "https://facebook.com/khmerwork",
                "https://twitter.com/khmerwork",
                "https://linkedin.com/company/khmerwork",
                "https://instagram.com/khmerwork"
              ],
              "description": "The leading platform for freelance and remote job opportunities in Cambodia."
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "KhmerWork",
              "url": "https://khmerwork.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://khmerwork.com/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              {children}
            </LoadingProvider>
            <AiChatBot />
            <Analytics />
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
