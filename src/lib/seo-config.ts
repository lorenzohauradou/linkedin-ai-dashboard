// SEO Configuration for Vibe Scaling App

export const seoConfig = {
  // Base site information
  siteName: "Vibe Scaling",
  siteUrl: "https://vibescaling.app",
  defaultTitle: "Vibe Scaling - AI-Powered LinkedIn Content Creation",
  titleTemplate: "%s | Vibe Scaling",
  
  // Default meta description
  defaultDescription: "Transform your LinkedIn presence with AI. Create engaging posts, learn your voice, and boost your professional authority with our AI-powered LinkedIn content generator.",
  
  // Keywords
  keywords: [
    "LinkedIn AI",
    "LinkedIn content generator",
    "AI content creation",
    "LinkedIn automation",
    "professional branding",
    "LinkedIn posts",
    "AI writing assistant",
    "LinkedIn marketing",
    "content marketing AI",
    "LinkedIn growth"
  ],
  
  // Author and company info
  author: "Vibe Scaling Team",
  company: "Vibe Scaling",
  
  // Social media
  social: {
    twitter: "@vibescaling",
    linkedin: "https://linkedin.com/company/vibescaling"
  },
  
  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vibe Scaling",
    images: [
      {
        url: "/icons/logo500.png",
        width: 500,
        height: 500,
        alt: "Vibe Scaling - AI-Powered LinkedIn Content Creation"
      }
    ]
  },
  
  // Twitter Card defaults
  twitter: {
    card: "summary_large_image",
    site: "@vibescaling",
    creator: "@vibescaling"
  }
}

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: "AI-Powered LinkedIn Content Creation",
    description: "Kill writer's block with the AI agent that learns your voice to boost your LinkedIn presence. Transform ideas into engaging posts that build your professional authority.",
    keywords: ["LinkedIn AI generator", "AI content creation", "LinkedIn automation", "professional branding"]
  },
  
  login: {
    title: "Login to Your AI Agent",
    description: "Access your personalized LinkedIn AI agent. Create engaging content, manage your professional brand, and scale your LinkedIn presence.",
    keywords: ["LinkedIn login", "AI agent access", "content creation platform"]
  },
  
  dashboard: {
    title: "Dashboard - Your AI Content Hub",
    description: "Manage your AI-powered LinkedIn content creation. Access your AI brains, generate posts, and track your professional growth.",
    keywords: ["LinkedIn dashboard", "AI content management", "LinkedIn analytics"]
  },
  
  postGenerator: {
    title: "AI Post Generator",
    description: "Create compelling LinkedIn posts with AI. Transform videos, PDFs, or ideas into engaging content that resonates with your audience.",
    keywords: ["LinkedIn post generator", "AI writing", "content creation tool"]
  },
  
  contentBrains: {
    title: "Content Brains - AI Learning Hub",
    description: "Train your AI with top performers' content. Build custom AI brains that understand your niche and create authentic, engaging posts.",
    keywords: ["AI training", "content learning", "LinkedIn AI brains", "personalized AI"]
  },
  
  generatedPosts: {
    title: "Generated Posts - Your Content Library",
    description: "View and manage all your AI-generated LinkedIn posts. Track performance, edit content, and optimize your professional presence.",
    keywords: ["LinkedIn posts", "content library", "post management", "LinkedIn analytics"]
  }
}

// Structured data templates
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vibe Scaling",
    "url": "https://vibescaling.app",
    "logo": "https://vibescaling.app/icons/logo500.png",
    "description": "AI-powered LinkedIn content creation platform that helps professionals scale their presence and build authority through intelligent content generation.",
    "sameAs": [
      "https://linkedin.com/company/vibescaling"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@vibescaling.app"
    }
  },
  
  webapp: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Vibe Scaling",
    "url": "https://vibescaling.app",
    "description": "AI-powered LinkedIn content creation platform",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free AI-powered LinkedIn content creation"
    },
    "featureList": [
      "AI Content Generation",
      "LinkedIn Integration",
      "Voice Learning",
      "Content Optimization",
      "Professional Branding"
    ]
  }
}
