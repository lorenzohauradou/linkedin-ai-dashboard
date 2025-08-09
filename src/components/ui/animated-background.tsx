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
            canvas.width = window.innerWidth
            canvas.height = document.documentElement.scrollHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        const gridSize = 40
        const dots: { x: number; y: number; opacity: number; fadeDirection: number; pulseSpeed: number }[] = []

        // Create grid of dots that covers the entire document
        for (let x = 0; x <= canvas.width + gridSize; x += gridSize) {
            for (let y = 0; y <= canvas.height + gridSize; y += gridSize) {
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
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, canvas.height)
                ctx.stroke()
            }

            // Horizontal lines
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(canvas.width, y)
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
        <div className="fixed inset-0 bg-white" style={{ zIndex: 0 }}>
            <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
        </div>
    )
}
