import * as React from "react"
import { animate } from "framer-motion"
import "./GlowingEffect.css"

type Props = {
    /** How far (px) outside the box the cursor still counts as "near". */
    proximity?: number
    /** Width (deg) of the glowing arc that follows the cursor. */
    spread?: number
    /** Radius (as a fraction of the box's shorter side) of the dead zone at
     *  the box's center — inside it, the effect is treated as inactive. */
    inactiveZone?: number
    /** Seconds for the arc to ease toward a new angle. */
    movementDuration?: number
    borderWidth?: number
    disabled?: boolean
    className?: string
}

// Adapted from a cursor-tracking "glowing border" interaction (originally a
// Tailwind + motion/react component) into plain CSS + framer-motion, using
// the site's own brand gradient instead of the original's arbitrary colors.
// Renders as an absolutely-positioned overlay — the parent needs
// `position: relative` and a border-radius for `inherit` to pick up.
export default function GlowingEffect({
    proximity = 48,
    spread = 34,
    inactiveZone = 0.5,
    movementDuration = 1,
    borderWidth = 1.5,
    disabled = false,
    className = "",
}: Props) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const lastPosition = React.useRef({ x: 0, y: 0 })
    const rafRef = React.useRef<number>(0)

    const handleMove = React.useCallback(
        (e?: PointerEvent | { x: number; y: number }) => {
            if (!containerRef.current) return
            if (rafRef.current) cancelAnimationFrame(rafRef.current)

            rafRef.current = requestAnimationFrame(() => {
                const element = containerRef.current
                if (!element) return

                const { left, top, width, height } =
                    element.getBoundingClientRect()
                const mouseX = e?.x ?? lastPosition.current.x
                const mouseY = e?.y ?? lastPosition.current.y
                if (e) lastPosition.current = { x: mouseX, y: mouseY }

                const center = [left + width * 0.5, top + height * 0.5]
                const distanceFromCenter = Math.hypot(
                    mouseX - center[0],
                    mouseY - center[1]
                )
                const inactiveRadius =
                    0.5 * Math.min(width, height) * inactiveZone

                if (distanceFromCenter < inactiveRadius) {
                    element.style.setProperty("--active", "0")
                    return
                }

                const isActive =
                    mouseX > left - proximity &&
                    mouseX < left + width + proximity &&
                    mouseY > top - proximity &&
                    mouseY < top + height + proximity

                element.style.setProperty("--active", isActive ? "1" : "0")
                if (!isActive) return

                const currentAngle =
                    parseFloat(element.style.getPropertyValue("--start")) || 0
                const targetAngle =
                    (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
                        Math.PI +
                    90
                const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
                const newAngle = currentAngle + angleDiff

                animate(currentAngle, newAngle, {
                    duration: movementDuration,
                    ease: [0.16, 1, 0.3, 1],
                    onUpdate: (value) => {
                        element.style.setProperty("--start", String(value))
                    },
                })
            })
        },
        [inactiveZone, proximity, movementDuration]
    )

    React.useEffect(() => {
        if (disabled) return
        const onScroll = () => handleMove()
        const onPointerMove = (e: PointerEvent) => handleMove(e)
        window.addEventListener("scroll", onScroll, { passive: true })
        document.body.addEventListener("pointermove", onPointerMove, {
            passive: true,
        })
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener("scroll", onScroll)
            document.body.removeEventListener("pointermove", onPointerMove)
        }
    }, [handleMove, disabled])

    if (disabled) return null

    return (
        <div
            ref={containerRef}
            style={
                {
                    "--glow-spread": spread,
                    "--glow-border-width": `${borderWidth}px`,
                    "--start": "0",
                    "--active": "0",
                } as React.CSSProperties
            }
            className={`glowing-effect ${className}`}
            aria-hidden="true"
        />
    )
}
