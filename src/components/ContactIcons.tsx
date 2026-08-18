// Small hand-drawn icon set for contact links (email / LinkedIn / resume),
// matching the site's existing convention of inline SVGs sized to their
// text line (see ProjectViewSwitcher, Carousel) rather than an icon
// library import.

export function EmailIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect
                x="1.5"
                y="3"
                width="13"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.3"
            />
            <path
                d="M2.5 4L8 8.5L13.5 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function LinkedInIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect
                x="1.5"
                y="1.5"
                width="13"
                height="13"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.3"
            />
            <circle cx="5.1" cy="5.1" r="1" fill="currentColor" />
            <path
                d="M5.1 7.3V11.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
            <path
                d="M8 11.5V8.8C8 7.8 8.6 7.1 9.5 7.1C10.4 7.1 10.9 7.8 10.9 8.8V11.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 7.3V11.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    )
}

export function ResumeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
                d="M4 1.5H9.5L13 5V13.5C13 13.9 12.65 14.25 12.25 14.25H4C3.6 14.25 3.25 13.9 3.25 13.5V2.25C3.25 1.85 3.6 1.5 4 1.5Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
            <path
                d="M9.5 1.5V5H13"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
            <path
                d="M5.5 8.5H10.5M5.5 10.5H10.5M5.5 12H8.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
        </svg>
    )
}
