import * as React from "react"
import "./CaseStudySectionNav.css"

export type CaseStudySection = {
    id: string
    label: string
}

type Props = {
    sections: CaseStudySection[]
}

// Reusable left-hand "jump to section" nav for case study pages. Fades in
// once the reader has scrolled past the hero, tracks which section is
// currently in view via IntersectionObserver, and smooth-scrolls on click.
export default function CaseStudySectionNav({ sections }: Props) {
    const [activeId, setActiveId] = React.useState(sections[0]?.id)
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.6)
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    React.useEffect(() => {
        const els = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => !!el)
        if (els.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id)
                })
            },
            { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
        )
        els.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [sections])

    const activeIndex = Math.max(
        0,
        sections.findIndex((s) => s.id === activeId)
    )

    const handleClick = (id: string) => {
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <nav
            className={
                "case-nav" + (visible ? " case-nav--visible" : "")
            }
            aria-label="Case study sections"
        >
            <div className="case-nav-track">
                <div
                    className="case-nav-indicator"
                    style={{
                        transform: `translateY(${activeIndex * 36}px)`,
                    }}
                />
                {sections.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        className={
                            "case-nav-item" +
                            (s.id === activeId ? " case-nav-item--active" : "")
                        }
                        onClick={() => handleClick(s.id)}
                    >
                        <span className="case-nav-item-label">{s.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    )
}
