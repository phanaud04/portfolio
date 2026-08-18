import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

// Re-implementation of the original Framer code component (see
// Components/TextCycler.tsx for the source). Framer-specific plumbing
// (`addPropertyControls`, the `framer` import, `useIsStaticRenderer`,
// configurable props) has been stripped and replaced with the hardcoded
// config below; the stagger/animation logic is unchanged.

type Props = {
    texts: string[]
}

const CONFIG = {
    staggerFrom: "last" as "first" | "last" | "center",
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-120%", opacity: 0 },
    staggerDuration: 0.025,
    rotationInterval: 4.5,
    loop: true,
    auto: true,
    splitBy: "characters" as const,
    duration: 0.5,
}

function splitIntoCharacters(text: string) {
    if (typeof Intl !== "undefined" && (Intl as any).Segmenter) {
        const segmenter = new (Intl as any).Segmenter("en", {
            granularity: "grapheme",
        })
        return Array.from(
            segmenter.segment(text),
            (segment: any) => segment.segment
        )
    }
    return Array.from(text)
}

export default function TextCycler({ texts }: Props) {
    const {
        staggerFrom,
        initial,
        animate,
        exit,
        staggerDuration,
        rotationInterval,
        loop,
        auto,
        splitBy,
        duration,
    } = CONFIG

    const [currentTextIndex, setCurrentTextIndex] = React.useState(0)
    const [reducedMotion, setReducedMotion] = React.useState(false)
    const intervalRef = React.useRef<number | null>(null)

    React.useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReducedMotion(mq.matches)
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    const elements = React.useMemo(() => {
        const currentText = texts[currentTextIndex] || ""
        if (splitBy === "characters") {
            const words = currentText.split(" ")
            return words.map((word, i) => ({
                characters: splitIntoCharacters(word),
                needsSpace: i !== words.length - 1,
            }))
        }
        return currentText.split(" ").map((word, i, arr) => ({
            characters: [word],
            needsSpace: i !== arr.length - 1,
        }))
    }, [texts, currentTextIndex, splitBy])

    const getStaggerDelay = React.useCallback(
        (index: number, totalChars: number) => {
            const total = totalChars
            if (staggerFrom === "first") return index * staggerDuration
            if (staggerFrom === "last")
                return (total - 1 - index) * staggerDuration
            const center = Math.floor(total / 2)
            return Math.abs(center - index) * staggerDuration
        },
        [staggerFrom, staggerDuration]
    )

    const next = React.useCallback(() => {
        setCurrentTextIndex((i) => {
            const nextIndex = i === texts.length - 1 ? (loop ? 0 : i) : i + 1
            return nextIndex
        })
    }, [texts.length, loop])

    React.useEffect(() => {
        if (!auto || reducedMotion || texts.length <= 1) return
        intervalRef.current = window.setInterval(
            next,
            rotationInterval * 1000
        )
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [next, rotationInterval, auto, reducedMotion, texts.length])

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
            }}
            aria-label={texts[currentTextIndex]}
        >
            <span style={{ position: "absolute", left: -9999, opacity: 0 }}>
                {texts[currentTextIndex]}
            </span>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={reducedMotion ? "static" : currentTextIndex}
                    style={{ display: "flex", alignItems: "center" }}
                    aria-hidden="true"
                >
                    {elements.map((wordObj, wordIndex, array) => {
                        const previousCharsCount = array
                            .slice(0, wordIndex)
                            .reduce(
                                (sum, word) => sum + word.characters.length,
                                0
                            )
                        const totalChars = array.reduce(
                            (sum, word) => sum + word.characters.length,
                            0
                        )
                        return (
                            <span
                                key={wordIndex}
                                style={{
                                    display: "inline-flex",
                                    overflow: "hidden",
                                    paddingBottom: "0.1em",
                                }}
                            >
                                {wordObj.characters.map((char, charIndex) =>
                                    reducedMotion ? (
                                        <span
                                            key={charIndex}
                                            style={{ display: "inline-block" }}
                                        >
                                            {char}
                                        </span>
                                    ) : (
                                        <motion.span
                                            key={charIndex}
                                            initial={initial}
                                            animate={animate}
                                            exit={exit}
                                            transition={{
                                                ease: "easeInOut",
                                                duration,
                                                delay: getStaggerDelay(
                                                    previousCharsCount +
                                                        charIndex,
                                                    totalChars
                                                ),
                                            }}
                                            style={{ display: "inline-block" }}
                                        >
                                            {char}
                                        </motion.span>
                                    )
                                )}
                                {wordObj.needsSpace && (
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 4,
                                        }}
                                    />
                                )}
                            </span>
                        )
                    })}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}
