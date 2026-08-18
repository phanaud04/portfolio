import "./FractionStatRow.css"

type FractionStat = {
    numerator: number
    denominator: number
    body: string
}

// Simple flat "person" pictogram — circle head + rounded-shoulder body,
// sized so every icon shares the same baseline regardless of fill state.
function PersonIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            className={
                "fraction-stat-person" +
                (filled ? " fraction-stat-person--filled" : "")
            }
            viewBox="0 0 20 30"
            width="15"
            height="22.5"
            aria-hidden="true"
        >
            <circle cx="10" cy="6.5" r="4.5" />
            <path d="M2,29 C2,17.5 4.5,12 10,12 C15.5,12 18,17.5 18,29 Z" />
        </svg>
    )
}

// Reusable "X of Y participants said..." row — a big fraction, a short
// finding, and a row of little person icons (filled = the numerator,
// unfilled = the rest) visualizing the fraction. Used in case studies to
// call out interview/survey findings without flattening them into a
// static screenshot.
export default function FractionStatRow({
    stats,
}: {
    stats: FractionStat[]
}) {
    return (
        <div className="fraction-stat-row">
            {stats.map((s, i) => (
                <div className="fraction-stat" key={i}>
                    <p className="fraction-stat-number">
                        {s.numerator}/{s.denominator}
                    </p>
                    <p className="fraction-stat-body">{s.body}</p>
                    <div className="fraction-stat-people" aria-hidden="true">
                        {Array.from({ length: s.denominator }).map((_, d) => (
                            <PersonIcon key={d} filled={d < s.numerator} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
