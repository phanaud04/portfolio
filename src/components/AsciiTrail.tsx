import { useEffect, useRef } from "react"
import "./AsciiTrail.css"

/**
 * AsciiTrail
 * A canvas grid of ASCII glyphs that lights up along the cursor's trail,
 * decaying behind it. Re-implementation of the original Framer code
 * component (AsciiFlowTrail) with the Framer-specific plumbing
 * (`addPropertyControls`, the `framer` import, the canvas-editor preview
 * branch, configurable props) stripped and replaced with the hardcoded
 * config below — the drawing/animation logic is unchanged.
 */

type TrailPoint = { x: number; y: number; life: number }

const CONFIG = {
    // Floyd–Steinberg-style glyph ramp, dimmest → brightest.
    glyphSet: 3,
    scale: 24,
    gamma: 0,
    mix: 100,
    invertOrder: true,
    blendMode: "Normal" as const,

    radius: 20,
    strength: 82,
    turbulence: 100,
    tailLength: 100,
    drawBlendMode: "Screen" as const,

    trackMouse: 100,
    momentum: 42,
}

const GLYPH_SETS: Record<number, string> = {
    0: "●•·. ",
    1: "■□▪▫ ",
    2: "█▓▒░ ",
    3: "▣▤▥▦▧▨▩ ",
    4: "◆◇◈○◉◊◌ ",
}

// Same 5 stops as --gradient-audrey in tokens.css, so the twinkling glyphs
// read as the same brand gradient as the headline text.
const GRADIENT_STOPS = ["#AE5F00", "#A14FCC", "#003AD9", "#00872D", "#7E7601"].map(
    (hex) => ({
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    })
)

// Samples the brand gradient at horizontal position t (0..1), linearly
// interpolating between the nearest two of the 5 evenly-spaced stops.
function sampleGradient(t: number) {
    const clamped = Math.max(0, Math.min(1, t))
    const segments = GRADIENT_STOPS.length - 1
    const pos = clamped * segments
    const i = Math.min(segments - 1, Math.floor(pos))
    const localT = pos - i
    const a = GRADIENT_STOPS[i]
    const b = GRADIENT_STOPS[i + 1]
    return {
        r: Math.round(a.r + (b.r - a.r) * localT),
        g: Math.round(a.g + (b.g - a.g) * localT),
        b: Math.round(a.b + (b.b - a.b) * localT),
    }
}

export default function AsciiTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const frameRef = useRef<number | null>(null)
    const mousePos = useRef({ x: -9999, y: -9999 })
    const smoothPos = useRef({ x: -9999, y: -9999 })
    const trail = useRef<TrailPoint[]>([])
    const time = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        // The whole effect is a mouse-driven trail, so respecting
        // prefers-reduced-motion means just not running the loop at all
        // rather than freezing on some arbitrary frame.
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height
        }
        updateSize()
        const resizeObserver = new ResizeObserver(updateSize)
        resizeObserver.observe(canvas)

        // Tracked on window, not the canvas — the canvas sits *behind* the
        // footer's own text/links (they need to be clickable, so they paint
        // above it), which means it never receives mousemove while the
        // cursor is directly over that content: the browser routes the
        // event to whatever's topmost at that point, not to occluded
        // elements underneath. Listening on window and converting to
        // canvas-local coordinates every time tracks the cursor everywhere
        // over the footer regardless of what's on top at that pixel.
        const handleMouse = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            mousePos.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        }
        window.addEventListener("pointermove", handleMouse)

        const baseChars = GLYPH_SETS[CONFIG.glyphSet] ?? "@%#*+=-:. "
        const chars = CONFIG.invertOrder
            ? baseChars.split("").reverse().join("")
            : baseChars

        const animate = () => {
            time.current += 0.016
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            let targetX = mousePos.current.x
            let targetY = mousePos.current.y
            if (CONFIG.trackMouse < 100) {
                const autoX = canvas.width / 2 + Math.sin(time.current) * 150
                const autoY =
                    canvas.height / 2 + Math.cos(time.current * 0.7) * 150
                const trackFactor = CONFIG.trackMouse / 100
                targetX =
                    mousePos.current.x * trackFactor + autoX * (1 - trackFactor)
                targetY =
                    mousePos.current.y * trackFactor + autoY * (1 - trackFactor)
            }

            const momentumFactor = 1 - (CONFIG.momentum / 100) * 0.95
            smoothPos.current.x +=
                (targetX - smoothPos.current.x) * momentumFactor
            smoothPos.current.y +=
                (targetY - smoothPos.current.y) * momentumFactor

            trail.current.push({
                x: smoothPos.current.x,
                y: smoothPos.current.y,
                life: 1.0,
            })

            const maxLength = Math.floor((CONFIG.tailLength / 100) * 50) + 5
            while (trail.current.length > maxLength) trail.current.shift()

            const decay = 0.02 * (1 - CONFIG.tailLength / 100) + 0.01
            trail.current.forEach((p) => (p.life -= decay))
            trail.current = trail.current.filter((p) => p.life > 0)

            const charSize = Math.max(6, Math.floor((16 * CONFIG.scale) / 100))
            ctx.font = `${charSize}px monospace`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"

            // CONFIG.blendMode is a fixed "Normal", so this always resolves
            // to "source-over" — set directly instead of branching on a
            // value that can never be anything else.
            ctx.globalCompositeOperation = "source-over"

            const cols = Math.ceil(canvas.width / charSize)
            const rows = Math.ceil(canvas.height / charSize)

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * charSize + charSize / 2
                    const y = row * charSize + charSize / 2

                    let intensity = 0
                    trail.current.forEach((point) => {
                        const dist = Math.hypot(x - point.x, y - point.y)
                        const maxDist = (CONFIG.radius / 100) * 150
                        if (dist < maxDist) {
                            const value =
                                (1 - dist / maxDist) *
                                point.life *
                                (CONFIG.strength / 100)
                            // CONFIG.drawBlendMode is a fixed "Screen", so
                            // this always resolves to the screen formula —
                            // apply it directly instead of branching on a
                            // value that can never be anything else.
                            intensity = 1 - (1 - intensity) * (1 - value)
                        }
                    })

                    // Ambient twinkle — a sparse field of glyphs that pulse
                    // on their own timer, independent of the mouse, so the
                    // canvas isn't completely inert when nobody's hovering.
                    // A cheap sine-based hash gives each cell a stable
                    // pseudo-random seed; only the top slice of cells (by
                    // seed) ever twinkle, and only during the peak of their
                    // own (seed-offset) sine phase, so it reads as
                    // scattered stars blinking at their own pace rather
                    // than a uniform shimmer.
                    const twinkleSeed =
                        Math.abs(
                            Math.sin(col * 12.9898 + row * 78.233) * 43758.5453
                        ) % 1
                    if (twinkleSeed > 0.93) {
                        const twinkleWave = Math.sin(
                            time.current * 0.6 + twinkleSeed * Math.PI * 20
                        )
                        if (twinkleWave > 0.7) {
                            const twinkle = ((twinkleWave - 0.7) / 0.3) * 0.5
                            intensity = Math.max(intensity, twinkle)
                        }
                    }

                    if (CONFIG.turbulence > 0 && intensity > 0) {
                        const turb =
                            Math.sin(x * 0.01 + time.current) *
                            Math.cos(y * 0.01 + time.current * 0.7) *
                            (CONFIG.turbulence / 1000)
                        intensity += turb
                    }

                    if (CONFIG.gamma !== 0 && intensity > 0) {
                        intensity = Math.pow(intensity, 1 - CONFIG.gamma)
                    }

                    if (CONFIG.glyphSet > 0 && intensity > 0) {
                        const ditherAmount = 0.2
                        if (CONFIG.glyphSet === 1) {
                            const phase =
                                (Math.sin(col * 0.5) + Math.cos(row * 0.5)) *
                                ditherAmount
                            intensity += phase
                        } else if (CONFIG.glyphSet === 2) {
                            const phase =
                                ((col % 2) + (row % 2)) * ditherAmount -
                                ditherAmount
                            intensity += phase
                        } else if (CONFIG.glyphSet === 3) {
                            const bayer = [
                                [0, 8, 2, 10],
                                [12, 4, 14, 6],
                                [3, 11, 1, 9],
                                [15, 7, 13, 5],
                            ]
                            const threshold = bayer[row % 4][col % 4] / 16
                            intensity =
                                intensity > threshold ? 1 : intensity * 0.5
                        } else if (CONFIG.glyphSet === 4) {
                            const noise =
                                Math.random() * ditherAmount - ditherAmount / 2
                            intensity += noise
                        }
                    }

                    intensity = Math.max(0, Math.min(1, intensity))

                    if (intensity > 0.01) {
                        const charIndex = Math.min(
                            chars.length - 1,
                            Math.floor(intensity * chars.length)
                        )
                        const char = chars[charIndex]
                        const alpha = intensity * (CONFIG.mix / 100)

                        // Color sampled from the brand gradient by this
                        // cell's horizontal position, so the whole canvas
                        // reads as one continuous sweep (matches
                        // AudreyHeadline's gradient text) rather than
                        // every glyph being the same flat tint.
                        const { r, g, b } = sampleGradient(col / Math.max(1, cols - 1))
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

                        ctx.fillText(char, x, y)
                    }
                }
            }

            ctx.globalCompositeOperation = "source-over"
            frameRef.current = requestAnimationFrame(animate)
        }

        frameRef.current = requestAnimationFrame(animate)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("pointermove", handleMouse)
            if (frameRef.current) cancelAnimationFrame(frameRef.current)
        }
    }, [])

    return <canvas ref={canvasRef} className="ascii-trail-canvas" aria-hidden="true" />
}
