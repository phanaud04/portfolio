import * as React from "react"

// Re-implementation of the original Framer code component (see
// Components/AudreyHeadline.tsx for the source). Framer-specific plumbing
// (`addPropertyControls`, the `framer` import, configurable props) has been
// stripped and replaced with the hardcoded config below, but the animation
// and interaction logic is unchanged.

export type WordData = {
    text: string
    style: "gradient" | "plain"
}

const DEFAULT_WORDS: WordData[] = [
    { text: "Audrey", style: "gradient" },
    { text: "Phan", style: "gradient" },
    { text: "is", style: "gradient" },
    { text: "a", style: "gradient" },
    { text: "product", style: "gradient" },
    { text: "designer", style: "gradient" },
    { text: "who", style: "gradient" },
    { text: "solves", style: "gradient" },
    { text: "problems", style: "gradient" },
    { text: "with", style: "gradient" },
    { text: "an", style: "gradient" },
    { text: "art", style: "gradient" },
    { text: "director's", style: "gradient" },
    { text: "eye,", style: "gradient" },
    { text: "pairing", style: "plain" },
    { text: "deep", style: "plain" },
    { text: "thinking", style: "plain" },
    { text: "with", style: "plain" },
    { text: "craft", style: "plain" },
    { text: "that", style: "plain" },
    { text: "doesn't", style: "plain" },
    { text: "blend", style: "plain" },
    { text: "in.", style: "plain" },
]

const CONFIG = {
    colors: ["#AE5F00", "#A14FCC", "#003AD9", "#00872D", "#7E7601"],
    angle: 90,
    duration: 10,
    animateOnView: true,
    cursorRadius: 90,
    cursorStrength: 30,
    verticalReach: 22,
    wordSpacing: 4,
    // Fallback gap width if a character pins in without specifying one.
    pinnedGapSize: 56,
}

// getSnapPoint's hit-test padding around the headline's box, in px — also
// doubles as the "ready to drop" radius for getProximity.
const SNAP_PAD = 24
// Beyond this distance from the headline's box, proximity reads as "far".
// Between SNAP_PAD and this, it reads as "near".
const NEAR_DIST = 160

const headlineFontStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 100,
    fontSize: "30px",
    lineHeight: 0.95,
}

// How much wider than the gradient run's own width the background image is.
// Bigger = more of the color range visible as it sweeps. 3 matches the feel
// of the single-span "300% 300%" version.
const GRADIENT_SIZE_MULTIPLIER = 3

// Half-width (px) of the "dead center" zone used when deciding which side of
// a word to push toward. Without this, the push flips instantly from full
// left to full right the moment the cursor crosses a word's exact center
// (dx === 0). That's invisible on wide words because the cursor rarely sits
// exactly on center for long — but on very narrow words (like "an"), the
// entire hoverable width falls inside ordinary mouse jitter around center,
// so the push flips every frame and reads as a twitch. Blending across this
// zone instead of hard-switching fixes it.
const CENTER_DEADZONE = 6

// Extra room (in em) reserved below the baseline on gradient words only.
// `background-clip: text` paints strictly inside the element's box, and
// with `display: inline-block` that box is sized from the line box, which
// can end up a hair short of the font's actual descender depth (letters
// like "p", "g", "y"). The visible symptom is descenders getting sliced
// off on gradient words but not on the plain (non-clipped) ones. Adding
// bottom padding to the INNER paint span (not the outer positioning span)
// gives the descenders room without touching the geometry the cursor-push
// and gradient-offset math relies on.
const DESCENDER_PADDING_EM = 0.2

export default function AudreyHeadline({
    words = DEFAULT_WORDS,
    align = "center",
}: {
    words?: WordData[]
    align?: "left" | "center"
}) {
    const {
        colors,
        angle,
        duration,
        animateOnView,
        cursorRadius,
        cursorStrength,
        verticalReach,
        wordSpacing,
        pinnedGapSize,
    } = CONFIG

    const containerRef = React.useRef<HTMLParagraphElement>(null)
    const [visible, setVisible] = React.useState(!animateOnView)
    const [reducedMotion, setReducedMotion] = React.useState(false)

    // Outer wrapper spans — these get margin (layout / cursor-push).
    const wordEls = React.useRef<(HTMLSpanElement | null)[]>([])
    // Inner text spans for gradient words only — these get the gradient paint.
    const gradInnerEls = React.useRef<(HTMLSpanElement | null)[]>([])

    const currentLeft = React.useRef<number[]>([])
    const currentRight = React.useRef<number[]>([])
    // radius: an optional "footprint" half-width — when set (e.g. by a
    // dragged character), the push is measured from the edge of that
    // footprint instead of from a single point, so the whole body parts
    // the words rather than just its center.
    const mouse = React.useRef<{
        x: number
        y: number
        radius?: number
    } | null>(null)
    const startTime = React.useRef<number | null>(null)
    const rafId = React.useRef<number | null>(null)

    // ── Character drop-in support ──
    // gapId = index of the word right BEFORE the held-open gap (-1 means the
    // gap sits before the very first word). Set/cleared by AudreyCharacter
    // via window.__audreyHeadline, defined below.
    const pinnedGapRef = React.useRef<number | null>(null)
    const pinnedGapSizeRef = React.useRef<number>(pinnedGapSize)

    const gradient = React.useMemo(
        () => `linear-gradient(${angle}deg, ${colors.join(", ")})`,
        [angle, colors]
    )

    const firstGradIdx = React.useMemo(
        () => words.findIndex((w) => w.style === "gradient"),
        [words]
    )
    const lastGradIdx = React.useMemo(() => {
        for (let i = words.length - 1; i >= 0; i--) {
            if (words[i].style === "gradient") return i
        }
        return -1
    }, [words])

    if (currentLeft.current.length !== words.length) {
        currentLeft.current = words.map(() => 0)
        currentRight.current = words.map(() => 0)
    }

    // ── Respect prefers-reduced-motion (WCAG 2.2.2 / 2.3.3) ──
    React.useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReducedMotion(mq.matches)
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    // ── Reveal on scroll into view ──
    React.useEffect(() => {
        if (!animateOnView || !containerRef.current) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [animateOnView])

    // ── Public bridge for AudreyCharacter (or anything else) to talk to
    //    this headline: report a pointer-like position — optionally with a
    //    footprint radius — ask where a drop at (x,y) would land, gauge how
    //    close a drag is to being droppable, and pin/unpin a gap open so a
    //    dropped character has somewhere to sit. ──
    React.useEffect(() => {
        const api = {
            reportPointer: (x: number | null, y?: number, radius?: number) => {
                mouse.current =
                    x === null ? null : { x, y: y as number, radius }
            },
            getSnapPoint: (x: number, y: number) => {
                if (!containerRef.current) return null
                const box = containerRef.current.getBoundingClientRect()
                if (
                    x < box.left - SNAP_PAD ||
                    x > box.right + SNAP_PAD ||
                    y < box.top - SNAP_PAD ||
                    y > box.bottom + SNAP_PAD
                ) {
                    return null
                }

                const rects = wordEls.current.map((el) =>
                    el ? el.getBoundingClientRect() : null
                )

                // Group words by line (rounded top) so we only compare
                // gaps on the line closest to the drop's y position.
                const lines = new Map<number, { rect: DOMRect; idx: number }[]>()
                rects.forEach((r, idx) => {
                    if (!r) return
                    const key = Math.round(r.top)
                    const arr = lines.get(key) ?? []
                    arr.push({ rect: r, idx })
                    lines.set(key, arr)
                })
                if (lines.size === 0) return null

                let line: { rect: DOMRect; idx: number }[] = []
                let bestLineDist = Infinity
                lines.forEach((group) => {
                    const c = group[0].rect.top + group[0].rect.height / 2
                    const d = Math.abs(c - y)
                    if (d < bestLineDist) {
                        bestLineDist = d
                        line = group
                    }
                })
                line.sort((a, b) => a.idx - b.idx)

                // While dragging, the character continuously reports its
                // position here, which cosmetically parts nearby words via
                // margin — the same push a real cursor causes on hover (see
                // the render loop below). Right at drop, the two words
                // flanking the gap are usually already pushed apart by that
                // live effect, so their raw rects reflect a temporarily
                // widened gap, not the natural one. Once pinned, that hover
                // push clears (mouse goes null) and only the pin's own
                // margin remains — a different width than what was just
                // measured — so computing the target from the raw rects
                // systematically lands it short of the gap's real final
                // center. Subtracting each word's own currently-applied
                // margin backs out that contamination and measures the
                // natural, unpushed gap instead.
                const liveMargin = (
                    idx: number,
                    prop: "marginLeft" | "marginRight"
                ) => {
                    const el = wordEls.current[idx]
                    return el ? parseFloat(el.style[prop]) || 0 : 0
                }

                let bestGapIdx = line[0].idx - 1
                let bestGapX =
                    line[0].rect.left - liveMargin(line[0].idx, "marginLeft") - 10
                let bestDist = Math.abs(bestGapX - x)
                for (let i = 0; i < line.length; i++) {
                    const cur = line[i]
                    const next = line[i + 1]
                    const gapX = next
                        ? (cur.rect.right +
                              (next.rect.left -
                                  liveMargin(next.idx, "marginLeft") -
                                  liveMargin(cur.idx, "marginRight"))) /
                          2
                        : cur.rect.right + 10
                    const d = Math.abs(gapX - x)
                    if (d < bestDist) {
                        bestDist = d
                        bestGapX = gapX
                        bestGapIdx = cur.idx
                    }
                }

                const lineCenterY = line[0].rect.top + line[0].rect.height / 2
                const lineBottom = line[0].rect.bottom
                return {
                    x: bestGapX,
                    y: lineCenterY,
                    bottom: lineBottom,
                    gapId: bestGapIdx,
                }
            },
            // Coarse distance-to-box read used purely to stage the dragged
            // character's speech bubble ("far" → "near" → "ready") as it
            // approaches — independent of getSnapPoint's stricter hit test.
            getProximity: (x: number, y: number): "far" | "near" | "ready" => {
                if (!containerRef.current) return "far"
                const box = containerRef.current.getBoundingClientRect()
                const dx = Math.max(box.left - x, 0, x - box.right)
                const dy = Math.max(box.top - y, 0, y - box.bottom)
                const dist = Math.hypot(dx, dy)
                if (dist <= SNAP_PAD) return "ready"
                if (dist <= NEAR_DIST) return "near"
                return "far"
            },
            setPinnedGap: (gapId: number | null, size?: number) => {
                pinnedGapRef.current = gapId
                if (size) pinnedGapSizeRef.current = size
            },
            // Live position of the currently-pinned gap, re-measured from
            // the DOM every call instead of predicted once at drop time.
            // Confirmed by direct measurement: opening a gap can push a
            // trailing word on that line onto the NEXT line entirely
            // (reflow), which changes that line's total content and its
            // text-align:center recentering offset by an amount that has
            // nothing to do with the gap's own width — no formula computed
            // once at drop time can predict that. Reading the live rects
            // instead always lands exactly in the gap as it actually
            // renders, however the line reflows.
            getPinnedAnchor: () => {
                const gapId = pinnedGapRef.current
                if (gapId === null) return null
                const leftRect =
                    gapId >= 0
                        ? wordEls.current[gapId]?.getBoundingClientRect()
                        : null
                const rightRect =
                    wordEls.current[gapId + 1]?.getBoundingClientRect()
                // Opening the gap can push the right-hand word onto the
                // next line entirely (see the comment above) — if that's
                // happened, the two words the gap sits between are no
                // longer visually adjacent, so averaging their x positions
                // would land the character somewhere between two unrelated
                // lines. Treat it the same as "no right neighbor on this
                // line" instead: anchor off the left word alone, at the end
                // of its (now shorter) line.
                const sameRow =
                    leftRect &&
                    rightRect &&
                    Math.abs(leftRect.top - rightRect.top) < leftRect.height / 2
                if (leftRect && rightRect && sameRow) {
                    return {
                        x: (leftRect.right + rightRect.left) / 2,
                        y: (leftRect.top + leftRect.bottom) / 2,
                        bottom: leftRect.bottom,
                    }
                }
                if (rightRect && !leftRect) {
                    return {
                        x: rightRect.left - 10,
                        y: (rightRect.top + rightRect.bottom) / 2,
                        bottom: rightRect.bottom,
                    }
                }
                if (leftRect) {
                    return {
                        x: leftRect.right + 10,
                        y: (leftRect.top + leftRect.bottom) / 2,
                        bottom: leftRect.bottom,
                    }
                }
                return null
            },
        }
        ;(window as any).__audreyHeadline = api
        return () => {
            if ((window as any).__audreyHeadline === api) {
                delete (window as any).__audreyHeadline
            }
        }
    }, [])

    // ── Animation loop: outer spans get margin (cursor push, or a pinned
    //    gap held open for a dropped-in character), inner spans get a
    //    shared, pixel-accurate slice of one continuous gradient ──
    React.useEffect(() => {
        const loop = (timestamp: number) => {
            if (!reducedMotion && visible && startTime.current === null) {
                startTime.current = timestamp
            }
            const started =
                !reducedMotion && visible && startTime.current !== null
            const elapsed = started
                ? (timestamp - startTime.current!) / 1000
                : 0

            // 0 → 100 → 0, eased, over `duration` seconds
            // (frozen at a fixed, still-colorful position if the user prefers reduced motion)
            let wavePct = 40
            if (started) {
                const phase = (elapsed % duration) / duration
                wavePct = ((1 - Math.cos(phase * Math.PI * 2)) / 2) * 100
            }

            const rects = wordEls.current.map((el) =>
                el ? el.getBoundingClientRect() : null
            )

            // Measure the real pixel span of the gradient run so every word's
            // background lines up as one continuous image, not an isolated one.
            let runLeft = 0
            let runWidth = 0
            if (
                firstGradIdx !== -1 &&
                rects[firstGradIdx] &&
                rects[lastGradIdx]
            ) {
                runLeft = rects[firstGradIdx]!.left
                const runRight =
                    rects[lastGradIdx]!.left + rects[lastGradIdx]!.width
                runWidth = Math.max(runRight - runLeft, 1)
            }
            const imageWidth = runWidth * GRADIENT_SIZE_MULTIPLIER
            const basePixelOffset = -(imageWidth - runWidth) * (wavePct / 100)

            const pinnedGap = pinnedGapRef.current
            const pinnedHalf = pinnedGapSizeRef.current / 2

            words.forEach((w, i) => {
                const outerEl = wordEls.current[i]
                const rect = rects[i]
                if (!outerEl || !rect) return

                const cx = rect.left + rect.width / 2
                const cy = rect.top + rect.height / 2

                let targetLeft = 0
                let targetRight = 0

                if (mouse.current) {
                    const dy = cy - mouse.current.y
                    if (Math.abs(dy) < verticalReach) {
                        const dx = cx - mouse.current.x
                        const rawDist = Math.abs(dx)
                        // Treat mouse.current.radius as the half-width of
                        // whatever is hovering (a real cursor has none, a
                        // dragged character reports its body's half-width)
                        // — the push field starts at the edge of that
                        // footprint rather than its exact center.
                        const footprint = mouse.current.radius || 0
                        const dist = Math.max(0, rawDist - footprint)
                        if (dist < cursorRadius) {
                            const force = 1 - dist / cursorRadius
                            const push = force * cursorStrength
                            // Blend the push across CENTER_DEADZONE instead of
                            // hard-switching at dx === 0 — prevents twitching
                            // on narrow words. See constant comment above.
                            const t = Math.max(
                                -1,
                                Math.min(1, dx / CENTER_DEADZONE)
                            )
                            targetLeft = push * Math.max(t, 0)
                            targetRight = push * Math.max(-t, 0)
                        }
                    }
                }

                // A dropped-in character holds its gap open regardless of
                // where the mouse currently is.
                if (pinnedGap === i) {
                    targetRight = Math.max(targetRight, pinnedHalf)
                }
                if (pinnedGap === i - 1) {
                    targetLeft = Math.max(targetLeft, pinnedHalf)
                }

                let nl =
                    currentLeft.current[i] +
                    (targetLeft - currentLeft.current[i]) * 0.2
                let nr =
                    currentRight.current[i] +
                    (targetRight - currentRight.current[i]) * 0.2

                if (Math.abs(nl) < 0.05) nl = 0
                if (Math.abs(nr) < 0.05) nr = 0

                currentLeft.current[i] = nl
                currentRight.current[i] = nr

                outerEl.style.marginLeft = `${nl.toFixed(1)}px`
                outerEl.style.marginRight = `${nr.toFixed(1)}px`

                if (w.style === "gradient") {
                    const innerEl = gradInnerEls.current[i]
                    if (innerEl && runWidth > 0) {
                        const offsetInRun = rect.left - runLeft
                        innerEl.style.backgroundSize = `${imageWidth}px 100%`
                        innerEl.style.backgroundPositionX = `${(
                            basePixelOffset - offsetInRun
                        ).toFixed(1)}px`
                        innerEl.style.backgroundPositionY = "50%"
                    }
                }
            })

            rafId.current = requestAnimationFrame(loop)
        }

        rafId.current = requestAnimationFrame(loop)
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [
        words,
        visible,
        duration,
        cursorRadius,
        cursorStrength,
        verticalReach,
        firstGradIdx,
        lastGradIdx,
        reducedMotion,
    ])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (reducedMotion) return
        mouse.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
        mouse.current = null
    }

    const baseStyle: React.CSSProperties = {
        margin: 0,
        padding: 0,
        textAlign: align,
        width: "100%",
        wordSpacing: `${wordSpacing}px`,
    }

    return (
        <p
            ref={containerRef}
            style={baseStyle}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {words.map((word, i) => {
                if (word.style === "gradient") {
                    return (
                        <React.Fragment key={i}>
                            <span
                                ref={(el) => {
                                    wordEls.current[i] = el
                                }}
                                style={{ display: "inline-block" }}
                            >
                                <span
                                    ref={(el) => {
                                        gradInnerEls.current[i] = el
                                    }}
                                    style={{
                                        ...headlineFontStyle,
                                        backgroundImage: gradient,
                                        backgroundSize: "300% 100%",
                                        backgroundPosition: "0% 50%",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent",
                                        display: "inline-block",
                                        paddingBottom: `${DESCENDER_PADDING_EM}em`,
                                        overflow: "visible",
                                    }}
                                >
                                    {word.text}
                                </span>
                            </span>
                            {i < words.length - 1 ? " " : null}
                        </React.Fragment>
                    )
                }
                return (
                    <React.Fragment key={i}>
                        <span
                            ref={(el) => {
                                wordEls.current[i] = el
                            }}
                            style={{
                                ...headlineFontStyle,
                                color: "#000000",
                                display: "inline-block",
                            }}
                        >
                            {word.text}
                        </span>
                        {i < words.length - 1 ? " " : null}
                    </React.Fragment>
                )
            })}
        </p>
    )
}
