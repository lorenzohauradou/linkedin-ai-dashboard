"use client"

import { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
    text: string
    speed?: number
    onComplete?: () => void
    className?: string
    delay?: number
    shouldAnimate?: boolean
}

export function TypewriterText({
    text,
    speed = 20,
    onComplete,
    className = "",
    delay = 0,
    shouldAnimate = true
}: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState("")
    const [isComplete, setIsComplete] = useState(false)
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (!text) return

        // Se non deve animare o ha già animato, mostra il testo completo
        if (!shouldAnimate || hasAnimated.current) {
            setDisplayText(text)
            setIsComplete(true)
            return
        }

        setDisplayText("")
        setIsComplete(false)
        hasAnimated.current = true

        const timer = setTimeout(() => {
            let index = 0
            const interval = setInterval(() => {
                if (index < text.length) {
                    setDisplayText(text.slice(0, index + 1))
                    index++
                } else {
                    clearInterval(interval)
                    setIsComplete(true)
                    onComplete?.()
                }
            }, speed)

            return () => clearInterval(interval)
        }, delay)

        return () => clearTimeout(timer)
    }, [text, speed, delay, onComplete, shouldAnimate])

    return (
        <span className={className}>
            {displayText}
            {!isComplete && shouldAnimate && (
                <span className="animate-pulse">|</span>
            )}
        </span>
    )
}
