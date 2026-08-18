import "./ProjectViewSwitcher.css"

export type ProjectView = "stack" | "grid" | "grid3" | "list"

const VIEWS: { id: ProjectView; label: string }[] = [
    { id: "grid", label: "Two-column grid" },
    { id: "stack", label: "Stack layout" },
    { id: "grid3", label: "Three-column grid" },
    { id: "list", label: "List layout" },
]

function ViewIcon({ view }: { view: ProjectView }) {
    switch (view) {
        case "stack":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                        x="1.5"
                        y="2.5"
                        width="13"
                        height="4.5"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                    <rect
                        x="1.5"
                        y="9"
                        width="13"
                        height="4.5"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                </svg>
            )
        case "grid":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                        x="1.5"
                        y="1.5"
                        width="5.5"
                        height="5.5"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                    <rect
                        x="9"
                        y="1.5"
                        width="5.5"
                        height="5.5"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                    <rect
                        x="1.5"
                        y="9"
                        width="5.5"
                        height="5.5"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                    <rect
                        x="9"
                        y="9"
                        width="5.5"
                        height="5.5"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                    />
                </svg>
            )
        case "grid3":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    {[1.5, 6.25, 11].map((x) =>
                        [1.5, 6.25, 11].map((y) => (
                            <rect
                                key={`${x}-${y}`}
                                x={x}
                                y={y}
                                width="3.5"
                                height="3.5"
                                rx="0.8"
                                stroke="currentColor"
                                strokeWidth="1.2"
                            />
                        ))
                    )}
                </svg>
            )
        case "list":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    {[3, 8, 13].map((y) => (
                        <line
                            key={y}
                            x1="1.5"
                            y1={y}
                            x2="14.5"
                            y2={y}
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                        />
                    ))}
                </svg>
            )
    }
}

export default function ProjectViewSwitcher({
    value,
    onChange,
}: {
    value: ProjectView
    onChange: (view: ProjectView) => void
}) {
    return (
        <div className="view-switcher" role="group" aria-label="Project layout">
            {VIEWS.map((v) => (
                <button
                    key={v.id}
                    type="button"
                    title={v.label}
                    aria-label={v.label}
                    aria-pressed={value === v.id}
                    className={`view-switcher-btn${value === v.id ? " is-active" : ""}`}
                    onClick={() => onChange(v.id)}
                >
                    <ViewIcon view={v.id} />
                </button>
            ))}
        </div>
    )
}
