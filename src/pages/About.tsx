import type { CSSProperties } from "react"
import GlowingEffect from "../components/GlowingEffect"
import AudreyHeadline, { type WordData } from "../components/AudreyHeadline"
import AudreyFriend from "../components/AudreyFriend"
import AsciiTrail from "../components/AsciiTrail"
import { EmailIcon, LinkedInIcon, ResumeIcon } from "../components/ContactIcons"
import { CONTACT } from "../data/contact"
import "./About.css"

const ABOUT_HEADLINE_WORDS: WordData[] = [
    { text: "Hi,", style: "gradient" },
    { text: "I'm", style: "gradient" },
    { text: "Audrey!", style: "gradient" },
    { text: "⋆。°✩", style: "gradient" },
]

const TAPE_COLORS = [
    "rgba(174, 95, 0, 0.55)",
    "rgba(161, 79, 204, 0.55)",
    "rgba(0, 58, 217, 0.5)",
    "rgba(0, 135, 45, 0.5)",
    "rgba(126, 118, 1, 0.55)",
    "rgba(212, 1, 100, 0.45)",
]

const PHOTOS = [
    {
        src: "/images/about/graduation.jpg",
        alt: "Audrey holding up her graduation cap in front of a UW building",
        caption: "informatics degree: secured",
        rot: -8,
        tape: 2,
    },
    {
        src: "/images/about/rice-bowl.jpg",
        alt: "A rice bowl with egg, pork, and greens",
        caption: "certified plate-cleaner",
        rot: 6,
        tape: 5,
    },
    {
        src: "/images/about/hot-pot.jpg",
        alt: "A hot pot spread with rows of sliced meat",
        caption: "hot pot, obviously",
        rot: 4,
        tape: 4,
    },
    {
        src: "/images/about/gyeongbokgung.jpg",
        alt: "Audrey taking a selfie in front of Gyeongbokgung Palace",
        caption: "solo-travel adventures",
        rot: -7,
        tape: 3,
    },
    {
        src: "/images/about/coffee-cup.jpg",
        alt: "Audrey balancing an iced coffee cup on her cap, forced-perspective style",
        caption: "coffee in kyoto :)",
        rot: -5,
        tape: 0,
    },
    {
        src: "/images/about/hiking-summit.jpg",
        alt: "Audrey at a mountain summit overlooking a lake",
        caption: "10/10 view, 12/10 out of breath",
        rot: 8,
        tape: 1,
    },
]

// Two independent columns (not a locked-step grid) so the second column
// can start lower than the first and each photo can drift at its own
// rotation — reads as photos scattered across a corkboard instead of
// tidy 2x3 rows.
const PHOTO_COLUMNS = [
    PHOTOS.filter((_, i) => i % 2 === 0),
    PHOTOS.filter((_, i) => i % 2 === 1),
]

const SKILL_CATEGORIES = [
    {
        label: "UX/UI & Product Design",
        items: [
            "Design thinking",
            "Problem framing",
            "Product sense",
            "User research (qual + quant)",
            "Usability testing",
            "Heuristic evaluation",
            "User flows",
            "Journey mapping",
            "Wireframing",
            "Rapid prototyping",
            "Information architecture",
            "Interaction design",
            "Design systems",
            "Responsive/adaptive design",
            "Accessibility (WCAG)",
            "Content strategy",
            "Service design",
            "Competitive analysis",
            "Stakeholder alignment",
            "Design critique/presentation",
        ],
    },
    {
        label: "Visual & Graphic Design",
        items: [
            "Typography",
            "Color theory",
            "Layout & composition",
            "Branding/identity systems",
            "Illustration",
            "Iconography",
            "Marketing collateral",
            "Print + digital design",
            "Micro-interaction/motion awareness",
        ],
    },
    {
        label: "Front-End Development",
        items: [
            "HTML",
            "CSS",
            "JavaScript",
            "Java",
            "React",
            "Git/GitHub",
            "API integration",
            "Responsive coding",
            "Deployment (Vercel)",
            "Debugging",
        ],
    },
    {
        label: "AI-Forward Workflow",
        items: [
            "AI-assisted prototyping",
            "AI-assisted development",
            "Prompt engineering",
            "Workflow/process optimization with AI tools",
            "Translating design intent into AI-generated code",
        ],
    },
    {
        label: "Soft Skills",
        items: [
            "Cross-functional collaboration",
            "Storytelling",
            "User empathy",
            "Adaptability",
            "Self-directed learning",
            "Ownership",
            "Comfort with ambiguity",
            "Curiosity",
            "Resilience",
            "Prioritization under deadline pressure",
            "Critical thinking",
            "Giving/receiving feedback",
            "Stakeholder management",
            "Initiative",
            "Resourcefulness",
            "Conflict navigation",
            "Growth mindset",
            "Attention to detail",
            "Systems thinking",
            "Client relationship management",
            "Negotiation",
            "Mentorship",
        ],
    },
]

const TOOLS = ["Figma", "VS Code / Cursor", "Claude / ChatGPT", "Adobe Creative Suite"]

export default function About() {
    return (
        <main className="about-page">
            <div className="about-ascii-bg" aria-hidden="true">
                <AsciiTrail />
            </div>

            <div className="about-layout">
                <div className="about-text-col">
                    <div className="about-title-wrap">
                        <AudreyHeadline words={ABOUT_HEADLINE_WORDS} align="left" />
                    </div>

                    <p className="about-body about-body--lead">
                        I'm an interdisciplinary designer working in spaces of
                        innovative technology and visual art. I create products
                        that focus on functional systems and expressive design.
                    </p>

                    <div className="about-body-group">
                        <p className="about-section-label">Education</p>
                        <p className="about-body">
                            I recently just graduated at the University of
                            Washington with a Bachelor's of Science in
                            Informatics.
                        </p>
                    </div>

                    <div className="about-body-group">
                        <p className="about-section-label">Outside of design</p>
                        <p className="about-body">
                            I love experimenting with AI, going on hikes, and
                            trying new restaurants and cuisines!
                        </p>
                    </div>

                    <div className="about-body-group">
                        <p className="about-section-label">Let's connect</p>
                        <p className="about-body">
                            Feel free to reach out! I'd love to chat about all
                            things design and become friends :)
                        </p>

                        <div className="about-social-icons">
                            <a
                                href={`mailto:${CONTACT.email}`}
                                aria-label="Email Audrey"
                                data-cursor-label="email"
                            >
                                <EmailIcon />
                            </a>
                            <a
                                href={CONTACT.linkedinHref}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="Audrey's LinkedIn"
                                data-cursor-label="linkedin"
                            >
                                <LinkedInIcon />
                            </a>
                            <a
                                href={CONTACT.resumeHref}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="Audrey's resume"
                                data-cursor-label="resume"
                            >
                                <ResumeIcon />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="about-photo-col">
                    {PHOTO_COLUMNS.map((column, ci) => (
                        <div className="about-photo-column" key={ci}>
                            {column.map((photo, i) => (
                                <figure
                                    className="scrap-photo"
                                    key={photo.src}
                                    style={
                                        {
                                            "--rot": `${photo.rot}deg`,
                                        } as CSSProperties
                                    }
                                >
                                    <GlowingEffect
                                        proximity={40}
                                        spread={32}
                                        inactiveZone={0.4}
                                        borderWidth={2}
                                    />
                                    <span
                                        className={`scrap-tape scrap-tape--${i % 2}`}
                                        style={{ background: TAPE_COLORS[photo.tape] }}
                                        aria-hidden="true"
                                    />
                                    <div className="scrap-photo-frame">
                                        <img src={photo.src} alt={photo.alt} loading="lazy" />
                                    </div>
                                    <figcaption className="scrap-caption">
                                        {photo.caption}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <section className="about-skills-section">
                <div className="about-skills-col">
                    <p className="about-section-label">Skills</p>
                    {SKILL_CATEGORIES.map((category) => (
                        <div className="skill-category" key={category.label}>
                            <p className="skill-category-label">
                                {category.label}
                            </p>
                            <div className="skill-chip-list">
                                {category.items.map((item) => (
                                    <span className="skill-chip" key={item}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="about-tools-col">
                    <p className="about-section-label">Tools</p>
                    <div className="skill-chip-list">
                        {TOOLS.map((tool) => (
                            <span
                                className="skill-chip skill-chip--tool"
                                key={tool}
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <AudreyFriend />
        </main>
    )
}
