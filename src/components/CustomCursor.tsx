import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import "./CustomCursor.css"

// Any element can opt into a cursor label via data-cursor-label — linked
// project cards get "View Case Study" (see ProjectCard), and cards for
// still-in-progress projects can set their own note (e.g. Vesta) instead
// of showing nothing on hover.
const HOVER_TARGET_SELECTOR = "[data-cursor-label]"

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null)
    const [hovering, setHovering] = useState(false)
    const [label, setLabel] = useState("")
    const [variant, setVariant] = useState<"pill" | "note">("pill")
    const { pathname } = useLocation()

    // A click on a linked card navigates via React Router without ever
    // unmounting the element through a real mouseleave, so the pointer's
    // "over a target" state can survive the route change — reset it
    // explicitly whenever the page changes.
    useEffect(() => {
        setHovering(false)
    }, [pathname])

    useEffect(() => {
        const dot = dotRef.current
        if (!dot) return

        // Pointer events, not mouse events: AudreyCharacter calls
        // preventDefault() on its own pointerdown (so dragging it across
        // the headline doesn't also start a native text selection), and
        // per spec that suppresses the compatibility mouse events
        // (mousemove/mouseover/mouseout/mouseup) for the rest of that
        // drag. Listening on mousemove here meant this dot would freeze in
        // place the instant the character was picked up. Pointer events
        // aren't part of that suppression, so they keep tracking through
        // the whole drag.
        const onMove = (e: PointerEvent) => {
            dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
        }
        const onOver = (e: PointerEvent) => {
            const el = (e.target as HTMLElement).closest?.(
                HOVER_TARGET_SELECTOR
            ) as HTMLElement | null
            if (el) {
                setLabel(el.dataset.cursorLabel ?? "")
                setVariant(el.dataset.cursorVariant === "note" ? "note" : "pill")
                setHovering(true)
            }
        }
        const onOut = (e: PointerEvent) => {
            const target = (e.target as HTMLElement).closest?.(
                HOVER_TARGET_SELECTOR
            )
            const related = e.relatedTarget as HTMLElement | null
            if (target && !target.contains(related)) {
                setHovering(false)
            }
        }

        window.addEventListener("pointermove", onMove)
        document.addEventListener("pointerover", onOver)
        document.addEventListener("pointerout", onOut)
        return () => {
            window.removeEventListener("pointermove", onMove)
            document.removeEventListener("pointerover", onOver)
            document.removeEventListener("pointerout", onOut)
        }
    }, [])

    const className =
        "custom-cursor" +
        (hovering ? " custom-cursor--pill" : "") +
        (hovering && variant === "note" ? " custom-cursor--note" : "")

    return (
        <div
            ref={dotRef}
            className={className}
            style={{ transform: "translate3d(-100px, -100px, 0)" }}
            aria-hidden="true"
        >
            <span className="custom-cursor-label">{label}</span>
        </div>
    )
}
