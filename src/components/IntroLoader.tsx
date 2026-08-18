import { useEffect, useRef, useState, type CSSProperties } from "react"
import "./IntroLoader.css"

const VISIBLE_MS = 1400
const FADE_MS = 700
const REDUCED_MOTION_VISIBLE_MS = 500

type Phase = "visible" | "fading" | "done"

export default function IntroLoader() {
    const [phase, setPhase] = useState<Phase>("visible")
    const markRef = useRef<HTMLDivElement>(null)
    const [shrinkStyle, setShrinkStyle] = useState<CSSProperties>({})

    useEffect(() => {
        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        const visibleFor = reduced ? REDUCED_MOTION_VISIBLE_MS : VISIBLE_MS

        const toFading = setTimeout(() => {
            // Measure where the real nav logo lives and shrink the mark
            // into that exact spot, instead of just fading out in place —
            // reads as the loading mark "becoming" the nav logo.
            const logo = document.querySelector<HTMLElement>(".logo")
            const markEl = markRef.current
            if (logo && markEl && !reduced) {
                const logoRect = logo.getBoundingClientRect()
                const markRect = markEl.getBoundingClientRect()
                const scale = logoRect.width / markRect.width
                const dx =
                    logoRect.left +
                    logoRect.width / 2 -
                    (markRect.left + markRect.width / 2)
                const dy =
                    logoRect.top +
                    logoRect.height / 2 -
                    (markRect.top + markRect.height / 2)
                setShrinkStyle({
                    transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
                })
            }
            setPhase("fading")
        }, visibleFor)
        const toDone = setTimeout(() => setPhase("done"), visibleFor + FADE_MS)
        return () => {
            clearTimeout(toFading)
            clearTimeout(toDone)
        }
    }, [])

    if (phase === "done") return null

    return (
        <div
            className={`intro-loader${phase === "fading" ? " intro-loader--fading" : ""}`}
            aria-hidden="true"
        >
            <div
                ref={markRef}
                className="intro-loader-mark"
                style={phase === "fading" ? shrinkStyle : undefined}
            />
        </div>
    )
}
