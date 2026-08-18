import { useEffect, useMemo, useState } from "react"
import { PLAY_CATEGORIES, type PlayItem } from "../data/play"
import GlowingEffect from "../components/GlowingEffect"
import GradientCtaButton from "../components/GradientCtaButton"
import AsciiTrail from "../components/AsciiTrail"
import "./Play.css"

type EntrySize = "s" | "m" | "l"

type Entry = {
    id: string
    item: PlayItem
    categoryTitle: string
    size: EntrySize
}

// Small seeded PRNG (mulberry32) so the shuffle and size mix are stable
// across reloads instead of reshuffling the page on every render.
function mulberry32(seed: number) {
    let state = seed
    return function random() {
        state |= 0
        state = (state + 0x6d2b79f5) | 0
        let t = Math.imul(state ^ (state >>> 15), 1 | state)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function seededShuffle<T>(items: T[], rand: () => number): T[] {
    const out = [...items]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

const SIZES: EntrySize[] = ["s", "m", "l"]

const FLAT_ITEMS = PLAY_CATEGORIES.flatMap((category) =>
    category.items.map((item, i) => ({
        id: `${category.slug}-${i}`,
        item,
        categoryTitle: category.title,
    }))
)

// Builds one shuffled mix + 3-column masonry from a seed. The seed itself
// is randomized per page load (see Play()) so different visitors — and
// the same visitor on a reload — land on different arrangements, and the
// "Shuffle" button reruns this with a fresh seed on demand.
function buildColumns(seed: number): [Entry[], Entry[], Entry[]] {
    const rand = mulberry32(seed)
    const allItems: Entry[] = seededShuffle(FLAT_ITEMS, rand).map((entry) => ({
        ...entry,
        size: SIZES[Math.floor(rand() * SIZES.length)],
    }))

    // A single 3-column masonry — every item (images, videos, PDFs alike)
    // lands in whichever column comes next, so the grid reads as one
    // continuous mix rather than alternating "row" and "full-width" blocks.
    const columns: [Entry[], Entry[], Entry[]] = [[], [], []]
    allItems.forEach((entry, i) => columns[i % 3].push(entry))
    return columns
}

function PlayThumb({ item }: { item: PlayItem }) {
    if (item.type === "video") {
        return (
            <video
                className="play-thumb-media"
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
            />
        )
    }
    if (item.type === "pdf") {
        return (
            <div className="play-thumb-pdf">
                <svg width="34" height="34" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M4 1.5H9.5L13 5V13.5C13 13.9 12.65 14.25 12.25 14.25H4C3.6 14.25 3.25 13.9 3.25 13.5V2.25C3.25 1.85 3.6 1.5 4 1.5Z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.5 1.5V5H13"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M5.5 8.5H10.5M5.5 10.5H10.5M5.5 12H8.5"
                        stroke="currentColor"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="play-thumb-pdf-name">{item.name}</span>
            </div>
        )
    }
    return <img className="play-thumb-media" src={item.src} loading="lazy" alt={item.name} />
}

function PlayTile({
    entry,
    onExpand,
}: {
    entry: Entry
    onExpand: (entry: Entry) => void
}) {
    const { item, categoryTitle, size } = entry
    const clickable = item.type === "image"
    return (
        <figure
            className={
                "play-item" +
                ` play-item--${size}` +
                (clickable ? " play-item--clickable" : "")
            }
            onClick={clickable ? () => onExpand(entry) : undefined}
        >
            <div className="play-item-media">
                <GlowingEffect
                    proximity={40}
                    spread={32}
                    inactiveZone={0.4}
                    borderWidth={2}
                />
                <PlayThumb item={item} />
            </div>
            <div className="play-item-details">
                <figcaption className="play-item-details-inner">
                    {categoryTitle}
                </figcaption>
            </div>
        </figure>
    )
}

function Lightbox({ entry, onClose }: { entry: Entry; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    return (
        <div className="play-lightbox" onClick={onClose}>
            <button
                className="play-lightbox-close"
                onClick={onClose}
                aria-label="Close"
                type="button"
            >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M2 2L14 14M14 2L2 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
            <img
                src={entry.item.src}
                alt={entry.item.name}
                className="play-lightbox-media"
                onClick={(e) => e.stopPropagation()}
            />
            <p className="play-lightbox-caption">
                {entry.categoryTitle} · {entry.item.name}
            </p>
        </div>
    )
}

export default function Play() {
    const [expanded, setExpanded] = useState<Entry | null>(null)
    // Randomized on every mount (not a fixed seed) so each visit — and
    // each reload — lands on its own mix, not the same order every time.
    const [seed, setSeed] = useState(() => Date.now())
    const columns = useMemo(() => buildColumns(seed), [seed])

    return (
        <main className="play-page">
            <div className="play-ascii-bg" aria-hidden="true">
                <AsciiTrail />
            </div>

            <div className="play-toolbar">
                <GradientCtaButton onClick={() => setSeed(Date.now())}>
                    ⟲ Shuffle
                </GradientCtaButton>
            </div>

            <div className="play-cols">
                {columns.map((colEntries, ci) => (
                    <div className="play-col" key={ci}>
                        {colEntries.map((entry) => (
                            <PlayTile
                                key={entry.id}
                                entry={entry}
                                onExpand={setExpanded}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {expanded && (
                <Lightbox entry={expanded} onClose={() => setExpanded(null)} />
            )}
        </main>
    )
}
