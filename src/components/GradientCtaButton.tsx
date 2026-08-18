import * as React from "react"
import "./GradientCtaButton.css"

type Props = {
    children: React.ReactNode
    /** Element id to smooth-scroll to on click (for in-page "jump to" CTAs). */
    targetId?: string
    href?: string
    /** Opens `href` in a new tab with rel="noreferrer noopener" (external links). */
    external?: boolean
    onClick?: () => void
}

// Reusable pill CTA used across case studies (e.g. "Jump to Solution").
// Ring is a thin brand-gradient stroke that shifts color on hover, plus a
// subtle light-sweep "shine" that runs across the pill on hover.
export default function GradientCtaButton({
    children,
    targetId,
    href,
    external,
    onClick,
}: Props) {
    const handleClick = () => {
        if (targetId) {
            document.getElementById(targetId)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
        onClick?.()
    }

    const surfaceContent = (
        <>
            <span className="gradient-cta-shine" aria-hidden="true" />
            <span className="gradient-cta-label">{children}</span>
        </>
    )

    return (
        <span className="gradient-cta-wrap">
            {href ? (
                <a
                    className="gradient-cta"
                    href={href}
                    onClick={handleClick}
                    {...(external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                >
                    {surfaceContent}
                </a>
            ) : (
                <button
                    type="button"
                    className="gradient-cta"
                    onClick={handleClick}
                >
                    {surfaceContent}
                </button>
            )}
        </span>
    )
}
