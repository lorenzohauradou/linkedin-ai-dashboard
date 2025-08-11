"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LinkedInButton } from "../../components/ui/linkedin-button"
import Image from "next/image"
import { useIsMobile } from "../../hooks/use-mobile"
import { useAuth } from "../../contexts/auth-context"

function LoginContent() {
    const isMobile = useIsMobile()
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, isLoading, router])

    const getErrorMessage = (error: string) => {
        switch (error) {
            case 'oauth_error':
                return 'LinkedIn authentication was cancelled or failed.'
            case 'missing_params':
                return 'Authentication parameters were missing.'
            case 'auth_failed':
                return 'Authentication failed. Please try again.'
            case 'server_error':
                return 'Server error occurred. Please try again later.'
            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (isAuthenticated) {
        return null // Will redirect to dashboard
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
            <div className="w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300">
                            <Image
                                src="/icons/logoicon.png"
                                alt="Vibe Scaling"
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Vibe Scaling
                        </span>
                    </div>

                    <div className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Welcome to Vibe Scaling
                            </h1>
                            <p className="text-gray-600">
                                {isMobile
                                    ? "Login to start scaling your personal brand"
                                    : "Login with your LinkedIn account to start scaling your personal brand on LinkedIn"}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm text-center">
                                    {getErrorMessage(error)}
                                </p>
                            </div>
                        )}

                        <LinkedInButton className="w-full py-6 text-lg font-semibold rounded-xl" />

                        <div className="text-center text-sm text-gray-500">
                            By logging in, you agree to our{" "}
                            <a href="/terms" className="text-blue-600 hover:underline">
                                Terms of Service
                            </a>{" "}
                            and our{" "}
                            <a href="/privacy" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </a>
                        </div>
                    </div>

                    <div className="text-center space-y-4 pt-8">
                        <p className="text-sm text-gray-600">Used by over 2,500+ professionals</p>
                        <div className="flex justify-center gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10">
                                    <Image
                                        src={`/icons/trusted${i}.png`}
                                        alt={`Trusted company ${i}`}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
