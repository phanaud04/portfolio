import { Link } from "react-router-dom"

type Props = {
    /** Route to the next case study (e.g. "/bits"). */
    to: string
    /** Looping background clip for the card (e.g. that project's hero video). */
    video: string
    /** Project name shown as the headline (e.g. "BITS"). */
    title: string
}

// Closing "up next" card for case study pages — a dark, full-bleed video
// card linking to the sibling project. Shared by WsdotCaseStudy and
// BitsCaseStudy (see caseStudy.css's .case-next-project rules); reuse this
// for any future case study page instead of re-copying the markup.
export default function CaseStudyNextProject({ to, video, title }: Props) {
    return (
        <Link to={to} className="case-next-project">
            <div className="case-next-project-media">
                <video src={video} autoPlay loop muted playsInline />
            </div>
            <div className="case-next-project-text">
                <p className="case-eyebrow">Next Project</p>
                <h2 className="case-next-project-title">
                    {title} <span className="case-next-project-arrow">→</span>
                </h2>
            </div>
        </Link>
    )
}
