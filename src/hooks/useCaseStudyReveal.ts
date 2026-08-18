import { useLayoutEffect } from "react"

const REVEAL_SELECTOR =
    ".case-block, .case-stat, .case-feature-card, .case-takeaways li"

/**
 * Fades/slides case-study content into view the first time it scrolls
 * on screen. Call once per case study page. Progressive enhancement —
 * content stays fully visible if this never runs; see the
 * .case-reveal-ready rule in styles/caseStudy.css.
 *
 * Uses useLayoutEffect (not useEffect) so the "ready" class — which hides
 * the content pre-reveal — is applied before the browser's first paint.
 * With useEffect there'd be a one-frame flash of fully-visible content
 * before it got hidden and re-animated in.
 */
export default function useCaseStudyReveal() {
    useLayoutEffect(() => {
        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (reduced) return

        const els = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        els.forEach((el) => el.classList.add("case-reveal-ready"))

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("case-reveal-visible")
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
        )
        els.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])
}
