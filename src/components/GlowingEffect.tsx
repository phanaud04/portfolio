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
//
// Every instance used to run its own document-level pointermove listener
// and call getBoundingClientRect() independently in response — fine with a
// couple of instances, but pages like Play (~50 tiles, each with one of
// these) turned every mouse move into dozens of interleaved layout
// reads/writes, i.e. layout thrashing. A single shared listener below
// drives every mounted instance from one rAF, reading every instance's
// bounding rect first (one clean batch) and only then writing any style
// changes, so a page with N instances forces layout once per frame instead
// of up to N times.
type RegisteredInstance = {
    el: HTMLDivElement
    proximity: number
    inactiveZone: number
    movementDuration: number
    angleRef: React.MutableRefObject<number>
}

const registry = new Set<RegisteredInstance>()
const pointer = { x: 0, y: 0 }
let frameHandle: number | null = null
let listenersAttached = false

function processFrame() {
    frameHandle = null
    if (registry.size === 0) return

    // Phase 1 — reads only.
    const rects = new Map<RegisteredInstance, DOMRect>()
    registry.forEach((inst) => {
        rects.set(inst, inst.el.getBoundingClientRect())
    })

    // Phase 2 — writes only.
    registry.forEach((inst) => {
        const rect = rects.get(inst)
        if (!rect) return
        const { left, top, width, height } = rect
        const center = [left + width * 0.5, top + height * 0.5]
        const distanceFromCenter = Math.hypot(
            pointer.x - center[0],
            pointer.y - center[1]
        )
        const inactiveRadius = 0.5 * Math.min(width, height) * inst.inactiveZone

        if (distanceFromCenter < inactiveRadius) {
            inst.el.style.setProperty("--active", "0")
            return
        }

        const isActive =
            pointer.x > left - inst.proximity &&
            pointer.x < left + width + inst.proximity &&
            pointer.y > top - inst.proximity &&
            pointer.y < top + height + inst.proximity

        inst.el.style.setProperty("--active", isActive ? "1" : "0")
        if (!isActive) return

        const currentAngle = inst.angleRef.current
        const targetAngle =
            (180 * Math.atan2(pointer.y - center[1], pointer.x - center[0])) /
                Math.PI +
            90
        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
        const newAngle = currentAngle + angleDiff

        animate(currentAngle, newAngle, {
            duration: inst.movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
                inst.angleRef.current = value
                inst.el.style.setProperty("--start", String(value))
            },
        })
    })
}

function scheduleFrame() {
    if (frameHandle != null) return
    frameHandle = requestAnimationFrame(processFrame)
}

function handlePointerMove(e: PointerEvent) {
    pointer.x = e.clientX
    pointer.y = e.clientY
    scheduleFrame()
}

function handleScroll() {
    scheduleFrame()
}

function ensureListeners() {
    if (listenersAttached) return
    listenersAttached = true
    document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
    })
    window.addEventListener("scroll", handleScroll, { passive: true })
}

function releaseListenersIfIdle() {
    if (registry.size > 0 || !listenersAttached) return
    listenersAttached = false
    document.body.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("scroll", handleScroll)
}

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
    const angleRef = React.useRef(0)

    React.useEffect(() => {
        if (disabled) return
        const el = containerRef.current
        if (!el) return

        const instance: RegisteredInstance = {
            el,
            proximity,
            inactiveZone,
            movementDuration,
            angleRef,
        }
        registry.add(instance)
        ensureListeners()

        return () => {
            registry.delete(instance)
            releaseListenersIfIdle()
        }
    }, [disabled, proximity, inactiveZone, movementDuration])

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
