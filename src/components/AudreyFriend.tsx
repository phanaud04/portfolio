import * as React from "react"

/**
 * AudreyFriend
 * A dark hot pink, cat-eared companion for AudreyCharacter. Always patrols the
 * bottom of the screen (no card-climbing, dragging, falling, or headline
 * pinning — that's all AudreyCharacter-specific) with a looping speech
 * bubble introducing Audrey. Visual/motion code is a trimmed-down copy of
 * AudreyCharacter's "walking the floor" branch.
 */

const CONFIG = {
    color: "#C90064",
    earColor: "#FF7FB8",
    faceColor: "#FFFFFF",
    size: 58,
    walkSpeed: 38,
    bottomOffset: 28,
    startXPct: 22,
    armRestRotateDeg: 125,
}

const MESSAGE = "i'd like to introduce you to my friend Audrey!"

// Same blink beat as AudreyCharacter's generic (non-idle-loop) bubble.
const BUBBLE_CYCLE_TOTAL = 5
const BUBBLE_CYCLE_VISIBLE = 3.5

export default function AudreyFriend() {
    const { color, earColor, faceColor, size, walkSpeed, bottomOffset, startXPct } =
        CONFIG

    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const flipRef = React.useRef<HTMLDivElement>(null)
    const bodyGroupRef = React.useRef<SVGGElement>(null)
    const legLeftRef = React.useRef<SVGLineElement>(null)
    const legRightRef = React.useRef<SVGLineElement>(null)
    const armRightRef = React.useRef<SVGPathElement>(null)
    const bubbleRef = React.useRef<HTMLDivElement>(null)

    const renderPos = React.useRef({
        x: typeof window !== "undefined" ? (window.innerWidth * startXPct) / 100 : 200,
        y:
            (typeof window !== "undefined" ? window.innerHeight : 800) -
            bottomOffset -
            size / 2,
    })
    const direction = React.useRef<1 | -1>(1)
    const walkT = React.useRef(0)
    const bubbleT = React.useRef(0)

    React.useEffect(() => {
        let raf: number
        let last = performance.now()

        const loop = (t: number) => {
            const dt = Math.min((t - last) / 1000, 0.05)
            last = t

            const minX = size / 2 + 10
            const maxX = window.innerWidth - size / 2 - 10
            const groundY = window.innerHeight - bottomOffset - size / 2

            renderPos.current.x += direction.current * walkSpeed * dt
            if (renderPos.current.x <= minX) {
                renderPos.current.x = minX
                direction.current = 1
            } else if (renderPos.current.x >= maxX) {
                renderPos.current.x = maxX
                direction.current = -1
            }
            renderPos.current.y += (groundY - renderPos.current.y) * 0.25

            const halfSwing = 24
            walkT.current += dt * (walkSpeed / 10)
            const swing = Math.sin(walkT.current) * halfSwing
            if (legLeftRef.current)
                legLeftRef.current.style.transform = `rotate(${swing.toFixed(1)}deg)`
            if (legRightRef.current)
                legRightRef.current.style.transform = `rotate(${(-swing).toFixed(1)}deg)`
            if (bodyGroupRef.current) {
                const bob = Math.abs(Math.sin(walkT.current)) * -3
                bodyGroupRef.current.style.transform = `translateY(${bob.toFixed(1)}px)`
            }
            if (flipRef.current)
                flipRef.current.style.transform = `scaleX(${direction.current})`
            if (armRightRef.current)
                armRightRef.current.style.transform = `rotate(${CONFIG.armRestRotateDeg}deg)`

            bubbleT.current += dt
            if (bubbleRef.current) {
                const cyclePos = bubbleT.current % BUBBLE_CYCLE_TOTAL
                bubbleRef.current.style.visibility =
                    cyclePos < BUBBLE_CYCLE_VISIBLE ? "visible" : "hidden"
            }

            if (wrapperRef.current) {
                wrapperRef.current.style.left = `${renderPos.current.x}px`
                wrapperRef.current.style.top = `${renderPos.current.y}px`
            }

            raf = requestAnimationFrame(loop)
        }

        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [walkSpeed, bottomOffset, size])

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 99999,
            }}
            aria-hidden="true"
        >
            <div
                ref={wrapperRef}
                style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    transform: "translate(-50%, -50%)",
                }}
            >
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
                        width: 200,
                        textAlign: "center",
                        whiteSpace: "normal",
                        pointerEvents: "none",
                        visibility: "visible",
                    }}
                >
                    {MESSAGE}
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
                        <ellipse cx={100} cy={207} rx={55} ry={9} fill="#000000" opacity={0.1} />

                        <line
                            ref={legLeftRef}
                            x1={78}
                            y1={155}
                            x2={78}
                            y2={195}
                            stroke={color}
                            strokeWidth={12}
                            strokeLinecap="round"
                            style={{ transformBox: "view-box", transformOrigin: "78px 155px" }}
                        />
                        <line
                            ref={legRightRef}
                            x1={122}
                            y1={155}
                            x2={122}
                            y2={195}
                            stroke={color}
                            strokeWidth={12}
                            strokeLinecap="round"
                            style={{ transformBox: "view-box", transformOrigin: "122px 155px" }}
                        />

                        <g ref={bodyGroupRef}>
                            <path
                                d="M40,90 Q10,110 8,150"
                                fill="none"
                                stroke={color}
                                strokeWidth={12}
                                strokeLinecap="round"
                            />
                            <path
                                ref={armRightRef}
                                d="M160,90 Q195,70 185,35"
                                fill="none"
                                stroke={color}
                                strokeWidth={12}
                                strokeLinecap="round"
                                style={{ transformBox: "view-box", transformOrigin: "160px 90px" }}
                            />

                            {/* cat ears — outer triangle in body color, inner
                                triangle a lighter pink, tucked slightly
                                behind the head circle drawn right after */}
                            <path d="M62,42 L40,-8 L86,28 Z" fill={color} />
                            <path d="M138,42 L160,-8 L114,28 Z" fill={color} />
                            <path d="M65,36 L52,4 L82,29 Z" fill={earColor} />
                            <path d="M135,36 L148,4 L118,29 Z" fill={earColor} />

                            <circle cx={100} cy={90} r={70} fill={color} />

                            <circle cx={72} cy={85} r={4.5} fill={faceColor} />
                            <circle cx={128} cy={85} r={4.5} fill={faceColor} />

                            {/* whiskers */}
                            <path
                                d="M50,100 L18,95 M50,108 L18,111"
                                stroke={faceColor}
                                strokeWidth={2}
                                strokeLinecap="round"
                                opacity={0.9}
                            />
                            <path
                                d="M150,100 L182,95 M150,108 L182,111"
                                stroke={faceColor}
                                strokeWidth={2}
                                strokeLinecap="round"
                                opacity={0.9}
                            />

                            <path
                                d="M68,113 Q100,131 132,113"
                                fill="none"
                                stroke={faceColor}
                                strokeWidth={6}
                                strokeLinecap="round"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
