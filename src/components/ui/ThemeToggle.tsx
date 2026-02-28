"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-9 h-9 rounded-full bg-secondary/50" />
    }

    const isDark = theme === "dark"

    const handleToggle = () => {
        const next = isDark ? "light" : "dark"

        // --- View Transitions API path ---
        // Captures before/after snapshots and composites them on the GPU —
        // no layout thrashing, fully hardware-accelerated.
        if ("startViewTransition" in document) {
            // Store the button's centre as the clip-path origin so the circle
            // expands outward from the exact point the user clicked.
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect()
                const x = Math.round(rect.left + rect.width / 2)
                const y = Math.round(rect.top + rect.height / 2)
                document.documentElement.style.setProperty("--vt-origin-x", `${x}px`)
                document.documentElement.style.setProperty("--vt-origin-y", `${y}px`)
            }

            // `startViewTransition` freezes the current frame, applies the
            // setState inside the callback, then tweens between the two frames.
            ; (document as any).startViewTransition(() => {
                setTheme(next)
            })
        } else {
            // Fallback: CSS background-color transition (already on * selector)
            setTheme(next)
        }
    }

    return (
        <button
            ref={buttonRef}
            onClick={handleToggle}
            className="relative p-2 rounded-full hover:bg-secondary/80 transition-colors w-9 h-9 flex items-center justify-center overflow-hidden"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Icon swap is handled by framer-motion, independent of the page transition */}
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ y: -20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="w-5 h-5 text-amber-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ y: -20, opacity: 0, rotate: 90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="w-5 h-5 text-slate-600" />
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
