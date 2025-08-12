"use client"

import { useEffect, useState } from 'react'

interface TypewriterPlaceholderProps {
    phrases: string[]
    typingSpeed?: number
    pauseDuration?: number
}

export function TypewriterPlaceholder({
    phrases,
    typingSpeed = 50,
    pauseDuration = 3000
}: TypewriterPlaceholderProps) {
    const [currentText, setCurrentText] = useState("")
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        const currentPhrase = phrases[currentPhraseIndex]

        if (currentText.length < currentPhrase.length) {
            // Continua a digitare
            timeout = setTimeout(() => {
                setCurrentText(currentPhrase.substring(0, currentText.length + 1))
            }, typingSpeed)
        } else {
            // Finito di digitare, pausa poi cambia frase
            timeout = setTimeout(() => {
                setCurrentText("")
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
            }, pauseDuration)
        }

        return () => clearTimeout(timeout)
    }, [currentText, currentPhraseIndex, phrases, typingSpeed, pauseDuration])

    return (
        <span className="text-gray-400">
            {currentText}
            <span className="animate-pulse ml-1">|</span>
        </span>
    )
}