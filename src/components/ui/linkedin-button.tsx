"use client"

import { Button } from "./button"
import { useState } from "react"

interface LinkedInButtonProps {
    className?: string
}

export function LinkedInButton({ className }: LinkedInButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleLinkedInLogin = async () => {
        try {
            setIsLoading(true)

            // Get LinkedIn auth URL from Next.js API route
            const response = await fetch('/api/auth/linkedin/url')
            const data = await response.json()

            if (response.ok && data.auth_url) {
                // Store state for verification
                localStorage.setItem('linkedin_oauth_state', data.state)

                // Redirect to LinkedIn OAuth
                window.location.href = data.auth_url
            } else {
                throw new Error('Failed to get LinkedIn auth URL')
            }
        } catch (error) {
            console.error('LinkedIn login error:', error)
            alert('Failed to initiate LinkedIn login. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className={`bg-[#0A66C2] hover:bg-[#004182] text-white flex items-center gap-2 disabled:opacity-50 ${className}`}
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {isLoading ? "Connecting..." : "Continue with LinkedIn"}
        </Button>
    )
}
