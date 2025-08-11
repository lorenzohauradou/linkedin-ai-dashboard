"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            const devicePixelRatio = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()

            canvas.width = Math.max(window.innerWidth, document.documentElement.scrollWidth) * devicePixelRatio
            canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight) * devicePixelRatio

            canvas.style.width = Math.max(window.innerWidth, document.documentElement.scrollWidth) + 'px'
            canvas.style.height = Math.max(window.innerHeight, document.documentElement.scrollHeight) + 'px'

            ctx.scale(devicePixelRatio, devicePixelRatio)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        const gridSize = 40
        const dots: { x: number; y: number; opacity: number; fadeDirection: number; pulseSpeed: number }[] = []

        // Create grid of dots that covers the entire document
        const canvasDisplayWidth = Math.max(window.innerWidth, document.documentElement.scrollWidth)
        const canvasDisplayHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight)

        for (let x = 0; x <= canvasDisplayWidth + gridSize; x += gridSize) {
            for (let y = 0; y <= canvasDisplayHeight + gridSize; y += gridSize) {
                dots.push({
                    x,
                    y,
                    opacity: Math.random() * 0.3 + 0.1,
                    fadeDirection: Math.random() > 0.5 ? 1 : -1,
                    pulseSpeed: Math.random() * 0.003 + 0.001,
                })
            }
        }

        let animationFrame: number

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw grid lines with subtle animation  
            ctx.strokeStyle = "rgba(148, 163, 184, 0.1)"
            ctx.lineWidth = 1

            // Vertical lines
            for (let x = 0; x <= canvasDisplayWidth; x += gridSize) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, canvasDisplayHeight)
                ctx.stroke()
            }

            // Horizontal lines
            for (let y = 0; y <= canvasDisplayHeight; y += gridSize) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(canvasDisplayWidth, y)
                ctx.stroke()
            }

            // Draw and animate dots
            dots.forEach((dot) => {
                dot.opacity += dot.fadeDirection * dot.pulseSpeed
                if (dot.opacity <= 0.05 || dot.opacity >= 0.3) {
                    dot.fadeDirection *= -1
                }

                ctx.fillStyle = `rgba(148, 163, 184, ${dot.opacity})`
                ctx.beginPath()
                ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrame = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-white overflow-hidden z-0">
            <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
        </div>
    )
}
