import Hero from "../components/Hero"
import ProjectGrid from "../components/ProjectGrid"
import AudreyCharacter from "../components/AudreyCharacter"
import AsciiTrail from "../components/AsciiTrail"
import "./Home.css"

export default function Home() {
    return (
        <>
            <main className="home-page">
                <div className="home-ascii-bg" aria-hidden="true">
                    <AsciiTrail />
                </div>
                <Hero />
                <ProjectGrid />
            </main>
            <AudreyCharacter />
        </>
    )
}
