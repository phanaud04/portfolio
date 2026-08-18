import { Link } from "react-router-dom"
import type { Project } from "../data/projects"
import GlowingEffect from "./GlowingEffect"

export default function ProjectCard({ project }: { project: Project }) {
    const isExternal = project.href?.startsWith("http")
    const Wrapper = project.href ? (isExternal ? "a" : Link) : "article"
    const cursorProps = project.cursorNote
        ? {
              "data-cursor-label": project.cursorNote,
              "data-cursor-variant": "note",
          }
        : { "data-cursor-label": "View Case Study" }
    const wrapperProps = project.href
        ? {
              ...(isExternal
                  ? {
                        href: project.href,
                        target: "_blank",
                        rel: "noreferrer",
                    }
                  : { to: project.href }),
              className: "project-card project-card--linked",
              ...cursorProps,
          }
        : {
              className: "project-card",
              ...(project.cursorNote ? cursorProps : {}),
          }

    return (
        <Wrapper {...(wrapperProps as any)}>
            <GlowingEffect
                proximity={64}
                spread={40}
                inactiveZone={0.4}
                borderWidth={2}
            />
            <div className="project-card-media">
                {project.video ? (
                    <video
                        src={project.video}
                        poster={project.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <img src={project.image} alt={project.title} />
                )}
            </div>
            <div className="project-card-body">
                <div className="project-card-header">
                    <h4>{project.title}</h4>
                    <span className="chip">{project.category}</span>
                </div>
                <p className="project-card-desc">{project.description}</p>

                <div className="project-card-details-toggle" tabIndex={0}>
                    Details
                    <svg
                        className="chevron"
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M1 1L5 5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="project-card-details">
                    <div className="project-card-details-inner">
                        <div className="project-card-meta">
                            <p className="project-card-meta-label">Team</p>
                            <p className="project-card-meta-value">
                                {project.team}
                            </p>
                        </div>
                        <div className="project-card-meta">
                            <p className="project-card-meta-label">Role</p>
                            <p className="project-card-meta-value">
                                {project.role}
                            </p>
                        </div>
                        <div className="project-card-meta">
                            <p className="project-card-meta-label">
                                Timeline
                            </p>
                            <p className="project-card-meta-value">
                                {project.timeline}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
