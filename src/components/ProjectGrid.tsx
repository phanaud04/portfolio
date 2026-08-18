import { useState } from "react"
import { PROJECTS } from "../data/projects"
import ProjectCard from "./ProjectCard"
import ProjectViewSwitcher, { type ProjectView } from "./ProjectViewSwitcher"
import "./ProjectGrid.css"

export default function ProjectGrid() {
    const [view, setView] = useState<ProjectView>("grid")

    return (
        <div id="work">
            <ProjectViewSwitcher value={view} onChange={setView} />
            <section className={`project-grid project-grid--${view}`}>
                {PROJECTS.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                ))}
            </section>
        </div>
    )
}
