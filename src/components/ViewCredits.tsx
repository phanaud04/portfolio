import "./ViewCredits.css"

type Props = {
    /** Each string renders as its own line inside the tooltip; use "" for a blank line. */
    lines: string[]
}

// Small hover/focus tooltip revealing a project's full team credits, used
// next to the "Team" field on case study pages.
export default function ViewCredits({ lines }: Props) {
    return (
        <span className="view-credits" tabIndex={0}>
            View credits
            <span className="view-credits-tooltip" role="tooltip">
                {lines.map((line, i) => (
                    <span className="view-credits-line" key={i}>
                        {line || " "}
                    </span>
                ))}
            </span>
        </span>
    )
}
