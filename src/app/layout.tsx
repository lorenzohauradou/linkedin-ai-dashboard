import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '../contexts/auth-context'
import { Analytics } from "@vercel/analytics/next"
import { seoConfig, structuredData } from '../lib/seo-config'

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.author }],
  creator: seoConfig.company,
  publisher: seoConfig.company,

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seoConfig.siteUrl,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    siteName: seoConfig.siteName,
    images: seoConfig.openGraph.images
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    site: seoConfig.social.twitter,
    creator: seoConfig.social.twitter,
    images: seoConfig.openGraph.images
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add your verification codes when available)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  // Canonical URL
  metadataBase: new URL(seoConfig.siteUrl),

  // App-specific
  applicationName: seoConfig.siteName,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: seoConfig.siteName,
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/logo500.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.organization)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.webapp)
          }}
        />

        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
