"use client"

import { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { PostGeneratorProvider } from "../../../contexts/post-generator-context"
import { PostGeneratorRightPanel } from "./post-generator-right-panel"

interface PostGeneratorLayoutProps {
    children: ReactNode
}

function PostGeneratorContent({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)

        // Cleanup quando il componente viene smontato
        return () => {
            const rightPanelContainer = document.getElementById('post-generator-right-panel')
            if (rightPanelContainer) {
                rightPanelContainer.innerHTML = ''
            }
        }
    }, [])

    const rightPanelContainer = isClient
        ? document.getElementById('post-generator-right-panel')
        : null

    return (
        <>
            {children}
            {isClient && rightPanelContainer && createPortal(
                <PostGeneratorRightPanel />,
                rightPanelContainer
            )}
        </>
    )
}

export default function PostGeneratorLayout({ children }: PostGeneratorLayoutProps) {
    return (
        <PostGeneratorProvider>
            <PostGeneratorContent>
                {children}
            </PostGeneratorContent>
        </PostGeneratorProvider>
    )
}
