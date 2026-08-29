import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion, useMotionValue, useMotionTemplate, animate } from "framer-motion"

/**
 * CaseStudyTransition
 * A circle-wipe transition for navigating into a case study: a solid disc
 * expands from the click point until it covers the whole screen (masking
 * the route swap underneath), then shrinks back down from that same point
 * to reveal the new page — an iris in/out rather than a hard cut.
 *
 * Lives as a context so any link that wants this treatment (project cards,
 * the case study "next project" card) can trigger it without owning the
 * overlay itself — the overlay has to survive the route change it's
 * masking, so it's mounted once here rather than per-link.
 */

type TransitionContextValue = {
    startTransition: (x: number, y: number, href: string) => void
}

const CaseStudyTransitionContext =
    React.createContext<TransitionContextValue | null>(null)

export function useCaseStudyTransition() {
    const ctx = React.useContext(CaseStudyTransitionContext)
    if (!ctx) {
        throw new Error(
            "useCaseStudyTransition must be used within CaseStudyTransitionProvider"
        )
    }
    return ctx
}

const COVER_S = 0.55
const REVEAL_S = 0.55
// Gives the new route a beat to render (and ScrollToTop a beat to jump to
// the top) fully hidden behind the disc before it starts shrinking away —
// without this the reveal could start mid-layout-shift.
const REVEAL_DELAY_MS = 90
const WIPE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]

function distanceToFarthestCorner(x: number, y: number) {
    const dx = Math.max(x, window.innerWidth - x)
    const dy = Math.max(y, window.innerHeight - y)
    return Math.hypot(dx, dy)
}

export function CaseStudyTransitionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const navigate = useNavigate()
    const [active, setActive] = React.useState(false)
    const activeRef = React.useRef(false)
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 })
    const radius = useMotionValue(0)
    const clipPath = useMotionTemplate`circle(${radius}px at ${origin.x}px ${origin.y}px)`

    const startTransition = React.useCallback(
        (x: number, y: number, href: string) => {
            if (activeRef.current) return
            activeRef.current = true
            setOrigin({ x, y })
            radius.set(0)
            setActive(true)

            // Wait a frame so the browser paints the disc at radius 0
            // before animating it — starting the tween in the same tick as
            // mounting the overlay can get coalesced into the first paint
            // and skip straight to some interim size.
            requestAnimationFrame(() => {
                animate(radius, distanceToFarthestCorner(x, y), {
                    duration: COVER_S,
                    ease: WIPE_EASE,
                    onComplete: () => {
                        navigate(href)
                        setTimeout(() => {
                            animate(radius, 0, {
                                duration: REVEAL_S,
                                ease: WIPE_EASE,
                                onComplete: () => {
                                    activeRef.current = false
                                    setActive(false)
                                },
                            })
                        }, REVEAL_DELAY_MS)
                    },
                })
            })
        },
        [navigate, radius]
    )

    const value = React.useMemo(() => ({ startTransition }), [startTransition])

    return (
        <CaseStudyTransitionContext.Provider value={value}>
            {children}
            {active && (
                <motion.div
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 999999,
                        pointerEvents: "none",
                        background: "var(--color-accent)",
                        clipPath,
                    }}
                />
            )}
        </CaseStudyTransitionContext.Provider>
    )
}
