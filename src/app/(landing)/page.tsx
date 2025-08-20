"use client"

import { Header } from "../components/landing/header"
import { Video } from "../components/landing/video"
import { Hero } from "../components/landing/hero"
import { Features } from "../components/landing/features"
import CTA from "../components/landing/cta"
import { Footer } from "../components/landing/footer"
import AnimatedBackground from "../components/ui/animated-background"

export default function LandingPage() {

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        <Video />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}