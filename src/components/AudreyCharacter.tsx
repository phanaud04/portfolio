import * as React from "react"

/**
 * AudreyCharacter
 * Patrols back and forth on top of the second project card (BITS) only.
 * Idle loop, on repeat until picked up: stop + point the left arm toward
 * the headline for 5s while the bubble reads "pick me up, i wanna to go
 * over there!" → bubble hidden for 1s (still stopped) → resume walking and
 * show "i need to get to higher ground" for 5s → bubble hidden for 1s
 * (still walking) → loop back to the point gesture.
 *
 * Pick it up and drag it: it immediately says "i need to get to higher
 * ground" again (the same line, now because it's being held rather than
 * still waiting), arms and legs flail, mouth pops into an "o". The closer
 * the drag gets to the headline, the more insistent the line gets ("i need
 * to get to higher ground" → "almost there." → "right here!"). Let go over
 * the headline and it snaps into the gap between the two nearest words,
 * feet aligned to the text line (which the headline holds open for it),
 * mouth back to normal, and stays there ("why thank you") until the page
 * scrolls. Let go anywhere else and it falls (gravity-accelerated) straight
 * down to the bottom of the screen, startled ("ahh, that was scary!").
 *
 * Scrolling always knocks it down the same way, no matter what it's doing
 * at the time — walking, pointing, mid-drag, or pinned in the headline.
 * Every fall resets the idle loop to the very start (the "pick me up"
 * point gesture) and, as long as the card is still on screen when it
 * lands, heads straight back to patrolling it. If the card isn't reachable
 * at landing — scrolled out of view, or gone entirely — it settles for
 * patrolling the bottom of the viewport instead, and that's permanent for
 * the rest of the session: it won't jump back onto the card later just
 * because scrolling brings it back into view.
 *
 * A little speech bubble above its head shows/hides in step with what it's
 * doing (visible while pointing, pinned, or mid-"line 2" of the idle loop;
 * pulsing while dragging; forced visible while scared).
 *
 * Re-implementation of the original Framer code component (see
 * Components/AudreyCharacter.tsx for the source) with the Framer-specific
 * plumbing stripped and props replaced by the hardcoded config below.
 */

type Mode = "walking" | "pointing" | "dragging" | "falling" | "pinned"
type Proximity = "far" | "near" | "ready"

const CONFIG = {
    color: "#A14FCC",
    faceColor: "#FFFFFF",
    useGradient: false,
    gradientColors: ["#AE5F00", "#A14FCC", "#003AD9", "#00872D", "#7E7601"],
    gradientAngle: 90,
    size: 64,
    walkSpeed: 45,
    bottomOffset: 28,
    startXPct: 50,
    // px/s² — acceleration while falling after a drop or a scroll.
    gravity: 2200,
    // How far in from a card's edges the walk keeps its feet.
    cardWalkMargin: 20,
    // Index of the card it lives on (0 = WSDOT, 1 = BITS — the right card).
    walkCardIndex: 1,
    // Right arm's fixed "resting at the side" angle — rotated down from its
    // naturally-raised base pose (see the arm path comments below).
    armRestRotateDeg: 125,
    // Peak angle for the left arm's point/slash-toward-the-headline gesture.
    armPointRotateDeg: 120,
    // Idle loop timing: each of the two idle lines gets bubbleVisibleMs on
    // screen, then bubbleHiddenMs off, before the next one starts — a
    // steady 5s-on/1s-off beat for both lines.
    bubbleVisibleMs: 5000,
    bubbleHiddenMs: 1000,
    // Width of the gap the headline holds open once this docks into it.
    pinnedGapWidth: 56,
}

const CARD_SELECTOR = ".project-grid .project-card"

function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function getWalkCard(
    selector: string,
    index: number
): HTMLElement | null {
    const els = document.querySelectorAll<HTMLElement>(selector)
    return els[index] ?? null
}

// Whether the card's top edge — the specific point walking/pointing lerp
// toward as groundY — is actually on screen right now. Checking the edge
// itself (not just whether the card element broadly overlaps the
// viewport) matters because a tall card scrolled so only its bottom half
// is visible would pass a plain intersection test while its top is still
// well above the viewport.
function isCardWalkable(rect: DOMRect | null, feetOffset: number) {
    if (!rect) return false
    const groundY = rect.top - feetOffset
    return groundY >= -20 && groundY <= window.innerHeight - 20
}

// Rise → hold → fall envelope (0..1) for the point gesture, given progress
// (0..1) through its total duration.
function pointEnvelope(progress: number) {
    if (progress < 0.2) return easeInOutQuad(progress / 0.2)
    if (progress < 0.8) return 1
    return 1 - easeInOutQuad((progress - 0.8) / 0.2)
}

// Body (the circle) is ~70% of the viewBox width — used so the character
// reports a push-radius to the headline that matches its actual visual
// footprint, not its full bounding box (which includes the arms).
const BODY_WIDTH_RATIO = 0.7

// The viewBox is 200 x 220 and fills the wrapper's height exactly (the
// height is the constraining dimension under preserveAspectRatio meet), so
// viewBox y maps 1:1 to wrapper pixels. Feet-bottom sits at y=195 out of
// 220, i.e. this far below vertical center (110) as a fraction of `size`.
const FEET_OFFSET_RATIO = (195 - 110) / 220

// Speech bubble blink cycle, in seconds.
const BUBBLE_CYCLE_TOTAL = 4
const BUBBLE_CYCLE_VISIBLE = 3

// How long the "scared" message and surprised face stay up after a fall
// (covers the fall itself plus a beat after landing).
const SCARED_DURATION_MS = 2000

// Minimum time between scroll-triggered falls — without this, a single
// scroll gesture (which fires many "scroll" events, especially trackpad
// momentum) re-triggers a fresh fall every time the character lands and
// resumes walking, looping it through the fall animation for as long as
// scrolling continues.
const SCROLL_FALL_COOLDOWN_MS = 1500

// The two idle-loop lines, shown in order on repeat: line 0 while stopped
// and pointing at the headline, line 1 while walking.
const IDLE_BUBBLE_TEXTS = [
    "pick me up, i wanna to go over there!",
    "i need to get to higher ground.",
]

const BUBBLE_TEXT = {
    // Same line as idle-loop line 1 — grabbing it just recontextualizes why
    // it's saying this, it doesn't get a new line.
    draggingFar: IDLE_BUBBLE_TEXTS[1],
    draggingNear: "almost there.",
    draggingReady: "right here!",
    pinned: "why thank you.",
    scared: "ahh, that was scary!",
}

// Converts a CSS-style gradient angle (0deg = up, 90deg = right, matching
// the `angle` prop on AudreyHeadline) into SVG objectBoundingBox coords.
function angleToGradientCoords(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180
    const dx = Math.sin(rad)
    const dy = -Math.cos(rad)
    return {
        x1: 0.5 - dx / 2,
        y1: 0.5 - dy / 2,
        x2: 0.5 + dx / 2,
        y2: 0.5 + dy / 2,
    }
}

export default function AudreyCharacter({
    surfaceSelector = CARD_SELECTOR,
    surfaceIndex = CONFIG.walkCardIndex,
}: {
    /** CSS selector for the element(s) it patrols on top of. */
    surfaceSelector?: string
    /** Which match (in document order) it walks on. */
    surfaceIndex?: number
} = {}) {
    const {
        color,
        faceColor,
        useGradient,
        gradientColors,
        gradientAngle,
        size,
        walkSpeed,
        bottomOffset,
        startXPct,
        gravity,
    } = CONFIG

    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const flipRef = React.useRef<HTMLDivElement>(null)
    const bodyGroupRef = React.useRef<SVGGElement>(null)
    const legLeftRef = React.useRef<SVGLineElement>(null)
    const legRightRef = React.useRef<SVGLineElement>(null)
    const armLeftRef = React.useRef<SVGPathElement>(null)
    const armRightRef = React.useRef<SVGPathElement>(null)
    const bubbleRef = React.useRef<HTMLDivElement>(null)

    // Stable per-instance id so multiple AudreyCharacters on the same page
    // don't collide on the same <linearGradient id="...">.
    const gradientId = React.useRef(
        `audrey-char-grad-${Math.random().toString(36).slice(2)}`
    ).current

    const [modeState, setModeState] = React.useState<Mode>("walking")
    const modeRef = React.useRef<Mode>("walking")

    // Purely cosmetic hover affordance — the site hides the native cursor
    // (see CustomCursor), so "cursor: grab" alone is invisible. A small
    // scale-up plus the shared custom-cursor label (data-cursor-label
    // below) are what actually tell someone this thing is draggable.
    const [isHovering, setIsHovering] = React.useState(false)

    // Scared state — true while falling and for a beat after landing.
    // Kept in both a ref (for the rAF loop, which never reads React state
    // directly) and state (so bubbleText re-renders).
    const [scared, setScared] = React.useState(false)
    const scaredRef = React.useRef(false)
    const scaredTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null
    )
    const lastFallAt = React.useRef(0)

    // Set right before a scroll-triggered fall — forces walkTarget to
    // "bottom" at landing regardless of whether the card is still
    // reachable, so even a small scroll (card barely still on screen)
    // drops it for good instead of bouncing straight back up onto the
    // card. A drag that misses the headline falls too, but through the
    // normal reachability check (dropping mid-card-patrol should still
    // resume patrolling if the card is right there).
    const forceGroundOnLand = React.useRef(false)

    // How close a drag currently is to the headline — drives the bubble
    // text while dragging ("far" → "near" → "ready").
    const [proximity, setProximity] = React.useState<Proximity>("far")
    const proximityRef = React.useRef<Proximity>("far")

    // Idle loop phase: 0 = stopped + pointing, line 0 visible (5s) · 1 =
    // walking, bubble hidden (1s) · 2 = walking, line 1 visible (5s) ·
    // 3 = walking, bubble hidden (1s) · back to 0. Kept in both a ref (for
    // the rAF loop) and state (so bubbleText/visibility re-render when it
    // advances without an accompanying mode change, e.g. phase 1→2).
    const idlePhaseIndex = React.useRef(0)
    const idlePhaseElapsedMs = React.useRef(0)
    const [idlePhase, setIdlePhase] = React.useState(0)

    // Which walking surface to target: "card" follows the project card,
    // "bottom" wanders the viewport floor. This is a one-way latch, card →
    // bottom only, never the reverse — once the card is unreachable (off
    // screen, or not in the DOM) at any point this flips to "bottom" and
    // STAYS there permanently, even once the card scrolls back into view
    // or after further falls. Without that one-way rule, scrolling while
    // already grounded still counts as a "scroll" and re-triggers
    // startFalling(), which — since the character is already sitting at
    // floor level — lands instantly; if landing were allowed to re-promote
    // back to "card" whenever it's currently reachable, that instant
    // no-visible-fall relanding would read as the character teleporting
    // back onto the card the moment a scroll brings it back on screen.
    const walkTarget = React.useRef<"card" | "bottom">("card")

    // Lerp target while pinned into the headline gap.
    const targetPos = React.useRef({ x: 0, y: 0 })

    const renderPos = React.useRef({
        x:
            typeof window !== "undefined"
                ? (window.innerWidth * startXPct) / 100
                : 200,
        y: 0,
    })
    const fallVelocity = React.useRef(0)
    const feetOffset = size * FEET_OFFSET_RATIO
    const direction = React.useRef<1 | -1>(1)
    const walkT = React.useRef(0)
    const bubbleT = React.useRef(0)
    const dragOffset = React.useRef({ dx: 0, dy: 0 })

    const setMode = (m: Mode) => {
        modeRef.current = m
        setModeState(m)
    }

    // ── Bridge for AudreyHeadline: reports a push radius so the whole
    //    body — not a single point — parts the words while dragging near
    //    them (purely cosmetic; dropping never docks into the headline) ──
    const pushRadius = size * (BODY_WIDTH_RATIO / 2)

    const gradCoords = React.useMemo(
        () => angleToGradientCoords(gradientAngle),
        [gradientAngle]
    )
    const fillValue = useGradient ? `url(#${gradientId})` : color

    // Kicks off a gravity fall to the bottom of the screen and a startled
    // beat, from wherever the character currently is. Also releases any
    // gap it was holding open in the headline (a no-op if it wasn't
    // pinned) and clears any live pointer report (a no-op unless this fall
    // interrupted a drag). Resets the idle loop back to its start so that
    // once it lands and resumes patrolling, everything begins again from
    // the "pick me up" point gesture.
    const startFalling = () => {
        lastFallAt.current = performance.now()
        fallVelocity.current = 0
        ;(window as any).__audreyHeadline?.setPinnedGap?.(null)
        ;(window as any).__audreyHeadline?.reportPointer?.(null)
        idlePhaseIndex.current = 0
        idlePhaseElapsedMs.current = 0
        setIdlePhase(0)
        setMode("falling")

        scaredRef.current = true
        setScared(true)
        bubbleT.current = 0 // restart the blink cycle cleanly
        if (scaredTimeoutRef.current) clearTimeout(scaredTimeoutRef.current)
        scaredTimeoutRef.current = setTimeout(() => {
            scaredRef.current = false
            setScared(false)
        }, SCARED_DURATION_MS)
    }

    // ── Scrolling knocks the character down only while it's up somewhere
    //    it can fall from — patrolling the card, pinned in the headline, or
    //    mid-drag. Once it's already on the floor (walkTarget === "bottom"),
    //    it's not falling from anything, so scrolling leaves it alone to
    //    keep walking normally instead of restarting the startled beat (and
    //    the idle loop) on every scroll. A single scroll gesture fires
    //    dozens of "scroll" events — especially trackpad momentum, which
    //    keeps firing well after the fall-and-recovery cycle finishes — so
    //    this also only actually falls once per cooldown window instead of
    //    re-triggering on every event and glitching. ──
    React.useEffect(() => {
        const handleScroll = () => {
            if (modeRef.current === "falling") return
            if (performance.now() - lastFallAt.current < SCROLL_FALL_COOLDOWN_MS)
                return
            const elevated =
                modeRef.current === "pinned" ||
                modeRef.current === "dragging" ||
                walkTarget.current === "card"
            if (!elevated) return
            forceGroundOnLand.current = true
            startFalling()
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            if (scaredTimeoutRef.current) clearTimeout(scaredTimeoutRef.current)
        }
    }, [])

    // ── Main loop: always running, branches on mode ──
    React.useEffect(() => {
        let raf: number
        let last = performance.now()

        // Panic flail — legs thrash while dragging (held mid-air) or
        // falling (dropped); arms join in only while dragging. While
        // falling/scared the arms stay at rest instead — a startled drop
        // reads as limp/surprised, not flailing, so armRestRotateDeg takes
        // over via the generic rest-pose block further down instead.
        const applyFlail = (dt: number, flailArms: boolean) => {
            const dragSwing = 40 // degrees, bigger than walking/idle
            walkT.current += dt * 9
            const sway = Math.sin(walkT.current) * dragSwing
            if (legLeftRef.current)
                legLeftRef.current.style.transform = `rotate(${sway.toFixed(
                    1
                )}deg)`
            if (legRightRef.current)
                legRightRef.current.style.transform = `rotate(${(-sway).toFixed(
                    1
                )}deg)`

            if (!flailArms) return

            // Arms flail out of sync with the legs (and each other) so it
            // reads as panic, not a synced dance move.
            const flailL = Math.sin(walkT.current * 1.4) * 30
            const flailR = Math.sin(walkT.current * 1.8 + 1.2) * 30
            if (armLeftRef.current)
                armLeftRef.current.style.transform = `rotate(${flailL.toFixed(
                    1
                )}deg)`
            if (armRightRef.current)
                armRightRef.current.style.transform = `rotate(${flailR.toFixed(
                    1
                )}deg)`
        }

        const loop = (t: number) => {
            const dt = Math.min((t - last) / 1000, 0.05)
            last = t

            // ── Idle loop scheduler: advances the 4-phase point/walk cycle
            //    and keeps `mode` in sync with whichever phase is current.
            //    Only runs while not dragging/falling/pinned — those states
            //    override the idle loop entirely and leave its phase
            //    frozen until control returns to walking. Self-correcting
            //    (checks desired-vs-actual mode every frame, not just on
            //    phase transitions) so it also recovers correctly right
            //    after a fall, where the phase was reset to 0 by
            //    startFalling() but `mode` still says "walking" from the
            //    landing code below. ──
            if (modeRef.current === "walking" || modeRef.current === "pointing") {
                idlePhaseElapsedMs.current += dt * 1000
                const phaseIsVisible = idlePhaseIndex.current % 2 === 0
                const phaseDuration = phaseIsVisible
                    ? CONFIG.bubbleVisibleMs
                    : CONFIG.bubbleHiddenMs
                if (idlePhaseElapsedMs.current >= phaseDuration) {
                    idlePhaseElapsedMs.current = 0
                    idlePhaseIndex.current = (idlePhaseIndex.current + 1) % 4
                    setIdlePhase(idlePhaseIndex.current)
                }
                const desiredMode =
                    idlePhaseIndex.current === 0 ? "pointing" : "walking"
                if (modeRef.current !== desiredMode) {
                    walkT.current = 0
                    // Entering the point gesture always faces forward
                    // (see the "pointing" branch below for why), and
                    // resuming walking afterward should continue rightward
                    // rather than carry over whatever direction it had
                    // before the pause.
                    direction.current = 1
                    setMode(desiredMode)
                }
            }

            const mode = modeRef.current
            bubbleT.current += dt

            let card: HTMLElement | null = null
            let minX = 0
            let maxX = 0
            let groundY = 0
            if (mode === "walking" || mode === "pointing") {
                if (walkTarget.current === "card") {
                    card = getWalkCard(surfaceSelector, surfaceIndex)
                    const rect = card ? card.getBoundingClientRect() : null
                    if (!isCardWalkable(rect, feetOffset)) {
                        // Card isn't in the DOM, this instance mounted
                        // somewhere without a project grid, or it's
                        // scrolled out of view mid-walk — drop to the
                        // viewport-bottom wander and stick there (see
                        // walkTarget's declaration comment) rather than
                        // re-checking every frame, which would otherwise
                        // make it snap back onto the card the instant a
                        // scroll brings it back on screen.
                        walkTarget.current = "bottom"
                    } else if (card && rect) {
                        const margin = CONFIG.cardWalkMargin
                        minX = rect.left + margin + size / 2
                        maxX = Math.max(minX, rect.right - margin - size / 2)
                        // feetOffset, not size/2 — the sprite's feet sit
                        // well below its own vertical center (see
                        // FEET_OFFSET_RATIO), so this is what actually
                        // rests the feet on the card's top edge instead of
                        // hovering the whole body above it.
                        groundY = rect.top - feetOffset
                    }
                }
                if (walkTarget.current === "bottom") {
                    minX = size / 2 + 10
                    maxX = window.innerWidth - size / 2 - 10
                    groundY = window.innerHeight - bottomOffset - size / 2
                }
            }

            if (mode === "walking") {
                const halfSwing = 24 // degrees

                renderPos.current.x += direction.current * walkSpeed * dt
                if (renderPos.current.x <= minX) {
                    renderPos.current.x = minX
                    direction.current = 1
                } else if (renderPos.current.x >= maxX) {
                    renderPos.current.x = maxX
                    direction.current = -1
                }
                renderPos.current.y += (groundY - renderPos.current.y) * 0.25

                // Faster step cadence relative to walk speed — was /22,
                // now /10 so the legs snap through the stride quickly
                // instead of drifting through it.
                walkT.current += dt * (walkSpeed / 10)
                const swing = Math.sin(walkT.current) * halfSwing
                if (legLeftRef.current)
                    legLeftRef.current.style.transform = `rotate(${swing.toFixed(
                        1
                    )}deg)`
                if (legRightRef.current)
                    legRightRef.current.style.transform = `rotate(${(-swing).toFixed(
                        1
                    )}deg)`
                if (bodyGroupRef.current) {
                    const bob = Math.abs(Math.sin(walkT.current)) * -3
                    bodyGroupRef.current.style.transform = `translateY(${bob.toFixed(
                        1
                    )}px)`
                }
                if (flipRef.current) {
                    flipRef.current.style.transform = `scaleX(${direction.current})`
                }
            } else if (mode === "pointing") {
                // Stand still (aside from re-settling onto the card if the
                // page scrolls/resizes mid-gesture, or clamping back into
                // its bounds if this phase started right after a fall
                // landed somewhere off the card) while the arm animates.
                // Face forward (unflipped) so the left arm — drawn on the
                // screen-left side in that orientation — reads as reaching
                // toward the headline, which sits up and to the left of
                // this card.
                renderPos.current.x = Math.min(
                    Math.max(renderPos.current.x, minX),
                    maxX
                )
                renderPos.current.y += (groundY - renderPos.current.y) * 0.25
                if (flipRef.current) flipRef.current.style.transform = "scaleX(1)"
                if (legLeftRef.current) legLeftRef.current.style.transform = "rotate(0deg)"
                if (legRightRef.current) legRightRef.current.style.transform = "rotate(0deg)"

                // Skip the point/wag gesture while still scared (the tail
                // end of a fall's startled beat can land inside this
                // phase, since the idle loop resets straight into it) —
                // the arm just stays still at its side instead of reaching
                // for the headline mid-fright.
                if (scaredRef.current) {
                    if (armLeftRef.current)
                        armLeftRef.current.style.transform = "rotate(0deg)"
                } else {
                    const progress = Math.min(
                        1,
                        idlePhaseElapsedMs.current / CONFIG.bubbleVisibleMs
                    )
                    const envelope = pointEnvelope(progress)
                    // A little wag layered on top of the raise/hold/lower
                    // arc — reads as an insistent "up there, c'mon" gesture
                    // rather than a single static point.
                    const wag =
                        Math.sin(idlePhaseElapsedMs.current / 110) *
                        10 *
                        envelope
                    if (armLeftRef.current) {
                        armLeftRef.current.style.transform = `rotate(${(
                            envelope * CONFIG.armPointRotateDeg +
                            wag
                        ).toFixed(1)}deg)`
                    }
                }
                if (bodyGroupRef.current) {
                    const breathe = scaredRef.current
                        ? 0
                        : Math.sin(bubbleT.current * 3) * 1.5
                    bodyGroupRef.current.style.transform = `translateY(${breathe.toFixed(
                        1
                    )}px)`
                }
            } else if (mode === "falling") {
                // Gravity-accelerated drop to the bottom of the screen —
                // straight down from wherever the character currently is,
                // no homing toward any x target.
                fallVelocity.current += gravity * dt
                renderPos.current.y += fallVelocity.current * dt
                const floorY = window.innerHeight - bottomOffset - size / 2
                if (renderPos.current.y >= floorY) {
                    renderPos.current.y = floorY
                    fallVelocity.current = 0
                    walkT.current = 0
                    // Only ever demotes "card" → "bottom" here, never the
                    // reverse (see walkTarget's declaration comment) — if
                    // it was still trying to follow the card, check
                    // whether that's still reachable from here; if it had
                    // already given up on the card, leave it be. A
                    // scroll-triggered fall skips the reachability check
                    // entirely and always grounds it (see
                    // forceGroundOnLand's declaration comment).
                    if (walkTarget.current === "card") {
                        if (forceGroundOnLand.current) {
                            walkTarget.current = "bottom"
                        } else {
                            const landedCard = getWalkCard(surfaceSelector, surfaceIndex)
                            const landedRect = landedCard
                                ? landedCard.getBoundingClientRect()
                                : null
                            if (!isCardWalkable(landedRect, feetOffset)) {
                                walkTarget.current = "bottom"
                            }
                        }
                    }
                    forceGroundOnLand.current = false
                    setMode("walking")
                }
                applyFlail(dt, false)
            } else if (mode === "pinned") {
                // Docked in the headline gap — glide to the gap's live
                // position (re-measured every frame, not the spot predicted
                // at drop time) and hold a calm, static pose there. Opening
                // the gap can reflow a trailing word on that line onto the
                // next line entirely, which keeps shifting the gap's true
                // on-screen position for a beat after landing in a way no
                // formula can predict in advance; tracking it live is what
                // makes the character actually end up inside it however the
                // line settles.
                const anchor = (window as any).__audreyHeadline?.getPinnedAnchor?.()
                if (anchor) {
                    targetPos.current = {
                        x: anchor.x,
                        y:
                            (typeof anchor.bottom === "number"
                                ? anchor.bottom
                                : anchor.y) - feetOffset,
                    }
                }
                renderPos.current.x +=
                    (targetPos.current.x - renderPos.current.x) * 0.25
                renderPos.current.y +=
                    (targetPos.current.y - renderPos.current.y) * 0.25
                if (legLeftRef.current)
                    legLeftRef.current.style.transform = "rotate(0deg)"
                if (legRightRef.current)
                    legRightRef.current.style.transform = "rotate(0deg)"
                if (armLeftRef.current)
                    armLeftRef.current.style.transform = "rotate(0deg)"
                if (bodyGroupRef.current)
                    bodyGroupRef.current.style.transform = "translateY(0px)"
                if (flipRef.current) flipRef.current.style.transform = "scaleX(1)"
            } else {
                // dragging — renderPos is set directly by the pointermove
                // handler; legs and arms flail around energetically.
                applyFlail(dt, true)
            }

            // Right arm just rests at the character's side in every mode
            // except dragging, which has its own flailing animation. This
            // covers "falling" too — a startled drop keeps its arms limp
            // at rest rather than flailing — and "pointing", which only
            // ever gestures with the left arm.
            if (mode !== "dragging" && armRightRef.current) {
                armRightRef.current.style.transform = `rotate(${CONFIG.armRestRotateDeg}deg)`
            }
            // Left arm rests too, except mid-gesture (handled in the
            // "pointing" branch above, which sets its own rotation).
            if (
                (mode === "walking" || mode === "falling") &&
                armLeftRef.current
            ) {
                armLeftRef.current.style.transform = "rotate(0deg)"
            }

            // Speech bubble: forced fully visible while scared so the
            // startled line doesn't blink away; visible while pointing or
            // pinned; while walking, visible only during idle-loop phase 2
            // (line 1's on-beat — phases 1 and 3 are the 1s gaps either
            // side of it, and phase 0 doesn't apply here since it's the
            // "pointing" mode instead); pulsing on a short blink cycle
            // while dragging so a long hold still reads as "restated".
            if (bubbleRef.current) {
                if (scaredRef.current) {
                    bubbleRef.current.style.visibility = "visible"
                } else if (mode === "pointing" || mode === "pinned") {
                    bubbleRef.current.style.visibility = "visible"
                } else if (mode === "walking") {
                    bubbleRef.current.style.visibility =
                        idlePhaseIndex.current === 2 ? "visible" : "hidden"
                } else if (mode === "falling") {
                    bubbleRef.current.style.visibility = "hidden"
                } else {
                    const cyclePos = bubbleT.current % BUBBLE_CYCLE_TOTAL
                    bubbleRef.current.style.visibility =
                        cyclePos < BUBBLE_CYCLE_VISIBLE ? "visible" : "hidden"
                }
            }

            if (wrapperRef.current) {
                wrapperRef.current.style.left = `${renderPos.current.x}px`
                wrapperRef.current.style.top = `${renderPos.current.y}px`
            }

            raf = requestAnimationFrame(loop)
        }

        // Seed the starting spot from the card if it's already on screen,
        // so there's no jump-cut on first paint.
        const seedCard = getWalkCard(surfaceSelector, surfaceIndex)
        if (seedCard) {
            const rect = seedCard.getBoundingClientRect()
            renderPos.current = {
                x: rect.left + CONFIG.cardWalkMargin + size / 2,
                y: rect.top - feetOffset,
            }
        } else {
            renderPos.current.y =
                (typeof window !== "undefined" ? window.innerHeight : 800) -
                bottomOffset -
                size / 2
        }

        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [walkSpeed, bottomOffset, size, feetOffset, gravity, surfaceSelector, surfaceIndex])

    const handlePointerDown = (e: React.PointerEvent) => {
        // Without this, dragging the character across the headline also
        // starts a native text-selection drag on the words underneath it —
        // the browser doesn't know the pointer is "captured" by the
        // character for selection purposes, only for pointer-event
        // routing. That fights with our own drag (visible as a yellow text
        // selection painting in behind the character) and can desync the
        // final pointerup coordinates from where the character actually
        // is, causing a drop that should have pinned to fall instead.
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        fallVelocity.current = 0
        // Grabbing it out of the headline releases the gap it was holding
        // open (a no-op if it wasn't pinned).
        ;(window as any).__audreyHeadline?.setPinnedGap?.(null)
        proximityRef.current = "far"
        setProximity("far")
        bubbleT.current = 0 // show the "grabbed" line immediately, not mid-blink
        dragOffset.current = {
            dx: e.clientX - renderPos.current.x,
            dy: e.clientY - renderPos.current.y,
        }
        setMode("dragging")
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (modeRef.current !== "dragging") return
        renderPos.current.x = e.clientX - dragOffset.current.dx
        renderPos.current.y = e.clientY - dragOffset.current.dy
        const api = (window as any).__audreyHeadline
        api?.reportPointer?.(e.clientX, e.clientY, pushRadius)

        const prox: Proximity = api?.getProximity?.(e.clientX, e.clientY) ?? "far"
        if (prox !== proximityRef.current) {
            proximityRef.current = prox
            setProximity(prox)
        }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (modeRef.current !== "dragging") return
        const api = (window as any).__audreyHeadline
        const snap = api?.getSnapPoint?.(e.clientX, e.clientY)
        api?.reportPointer?.(null)
        if (snap) {
            const anchorY =
                typeof snap.bottom === "number" ? snap.bottom : snap.y
            targetPos.current = { x: snap.x, y: anchorY - feetOffset }
            api?.setPinnedGap?.(snap.gapId, CONFIG.pinnedGapWidth)
            setMode("pinned")
        } else {
            startFalling()
        }
    }

    // Surprised face (wide eyes, "O" mouth) while dragging or falling, and
    // for a beat after landing. Pointing and pinned are calm, intentional
    // states, so they keep the normal smile.
    const surprised = modeState === "dragging" || scared
    const eyeR = surprised ? 6 : 4.5

    // Phases 0-1 belong to line 0 (point gesture, then its trailing gap),
    // phases 2-3 belong to line 1 (walking, then its trailing gap).
    let bubbleText = IDLE_BUBBLE_TEXTS[idlePhase < 2 ? 0 : 1]
    if (scared) {
        bubbleText = BUBBLE_TEXT.scared
    } else if (modeState === "dragging") {
        bubbleText =
            proximity === "ready"
                ? BUBBLE_TEXT.draggingReady
                : proximity === "near"
                  ? BUBBLE_TEXT.draggingNear
                  : BUBBLE_TEXT.draggingFar
    } else if (modeState === "pinned") {
        bubbleText = BUBBLE_TEXT.pinned
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 99999,
            }}
        >
            <div
                ref={wrapperRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerEnter={() => setIsHovering(true)}
                onPointerLeave={() => setIsHovering(false)}
                data-cursor-label="drag me!"
                style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    transform: `translate(-50%, -50%) scale(${
                        isHovering && modeState !== "dragging" ? 1.12 : 1
                    })`,
                    transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    pointerEvents: "auto",
                    touchAction: "none",
                    cursor: modeState === "dragging" ? "grabbing" : "grab",
                    userSelect: "none",
                }}
            >
                {/* speech bubble — sits outside the flip wrapper so it
                    never mirrors with the character's walking direction */}
                <div
                    ref={bubbleRef}
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginBottom: 14,
                        background: "#000000",
                        color: "#FFFFFF",
                        borderRadius: 11,
                        padding: "7px 12px",
                        fontFamily: "var(--font-footer)",
                        fontSize: 12,
                        lineHeight: 1.3,
                        width: 210,
                        textAlign: "center",
                        whiteSpace: "normal",
                        pointerEvents: "none",
                        visibility: "visible",
                    }}
                >
                    {bubbleText}
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "8px solid transparent",
                            borderRight: "8px solid transparent",
                            borderTop: "8px solid #000000",
                        }}
                    />
                </div>

                <div ref={flipRef} style={{ width: "100%", height: "100%" }}>
                    <svg
                        viewBox="0 0 200 220"
                        width="100%"
                        height="100%"
                        style={{ display: "block", overflow: "visible" }}
                    >
                        <defs>
                            <linearGradient
                                id={gradientId}
                                x1={gradCoords.x1}
                                y1={gradCoords.y1}
                                x2={gradCoords.x2}
                                y2={gradCoords.y2}
                            >
                                {gradientColors.map((c, i) => (
                                    <stop
                                        key={i}
                                        offset={`${
                                            (i /
                                                Math.max(
                                                    gradientColors.length - 1,
                                                    1
                                                )) *
                                            100
                                        }%`}
                                        stopColor={c}
                                    />
                                ))}
                            </linearGradient>
                        </defs>

                        {/* shadow */}
                        <ellipse
                            cx={100}
                            cy={207}
                            rx={55}
                            ry={9}
                            fill="#000000"
                            opacity={0.1}
                        />

                        {/* legs — straight, swing from the hip. Same
                            stroke width as the arms. */}
                        <line
                            ref={legLeftRef}
                            x1={78}
                            y1={155}
                            x2={78}
                            y2={195}
                            stroke={fillValue}
                            strokeWidth={12}
                            strokeLinecap="round"
                            style={{
                                transformBox: "view-box",
                                transformOrigin: "78px 155px",
                            }}
                        />
                        <line
                            ref={legRightRef}
                            x1={122}
                            y1={155}
                            x2={122}
                            y2={195}
                            stroke={fillValue}
                            strokeWidth={12}
                            strokeLinecap="round"
                            style={{
                                transformBox: "view-box",
                                transformOrigin: "122px 155px",
                            }}
                        />

                        <g ref={bodyGroupRef}>
                            {/* arms — drawn first so the body's edge
                                overlaps their base for a seamless join.
                                Each pivots from its shoulder point. */}
                            <path
                                ref={armLeftRef}
                                d="M40,90 Q10,110 8,150"
                                fill="none"
                                stroke={fillValue}
                                strokeWidth={12}
                                strokeLinecap="round"
                                style={{
                                    transformBox: "view-box",
                                    transformOrigin: "40px 90px",
                                }}
                            />
                            <path
                                ref={armRightRef}
                                d="M160,90 Q195,70 185,35"
                                fill="none"
                                stroke={fillValue}
                                strokeWidth={12}
                                strokeLinecap="round"
                                style={{
                                    transformBox: "view-box",
                                    transformOrigin: "160px 90px",
                                }}
                            />

                            {/* body */}
                            <circle cx={100} cy={90} r={70} fill={fillValue} />

                            {/* eyes */}
                            <circle cx={72} cy={85} r={eyeR} fill={faceColor} />
                            <circle
                                cx={128}
                                cy={85}
                                r={eyeR}
                                fill={faceColor}
                            />

                            {/* mouth — curved smile normally, a solid
                                filled "O" while being dragged or startled */}
                            {surprised ? (
                                <circle
                                    cx={100}
                                    cy={122}
                                    r={9}
                                    fill={faceColor}
                                />
                            ) : (
                                <path
                                    d="M68,113 Q100,131 132,113"
                                    fill="none"
                                    stroke={faceColor}
                                    strokeWidth={6}
                                    strokeLinecap="round"
                                />
                            )}
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
