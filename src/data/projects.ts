export type Project = {
    id: string
    title: string
    category: string
    timeline: string
    role: string
    team: string
    description: string
    image: string
    /** Optional cover video — takes over from `image` as the card's media
     *  when present (`image` is still used as its poster frame). */
    video?: string
    href?: string
    /** Optional custom-cursor label shown while hovering a card that has no
     *  `href` (e.g. still-in-progress projects) instead of no label at all. */
    cursorNote?: string
}

export const PROJECTS: Project[] = [
    {
        id: "wsdot",
        title: "WSDOT App Redesign",
        category: "Product Design",
        timeline: "2025 - 2026",
        role: "UX/UI Designer, UX Researcher",
        team: "iDOT (Capstone)",
        description:
            "Redesign of Washington State Department of Transportation's IOS app with 500k+ users.",
        image: "/images/projects/wsdot.png",
        video: "/images/wsdot/hero.mp4",
        href: "/wsdot",
    },
    {
        id: "bits",
        title: "BITS / Born in the Sound",
        category: "Product Design",
        timeline: "2024 - 2025",
        role: "Product Designer",
        team: "IM $TACKED (7-Person Team)",
        description:
            "Magazine and app companion bringing awareness to Seattle creatives' unique experiences and challenges",
        image: "/images/projects/bits.png",
        video: "/images/bits/hero.mp4",
        href: "/bits",
    },
    {
        id: "vesta",
        title: "vesta",
        category: "Product Design",
        timeline: "In progress",
        role: "Product Designer",
        team: "Solo Project (AI-assisted)",
        description:
            "A community-driven mobile app connecting marginalized renters through trusted circles, peer support, and plain-language rights resources — built end-to-end with AI as a design and development partner.",
        image: "/images/projects/vesta-cover.jpg",
        cursorNote: "project still in process. contact me for more details",
    },
    {
        id: "uw-conduct",
        title: "UW Student Conduct Site",
        category: "Product Design",
        timeline: "2025 - 2026",
        role: "UX Design Intern",
        team: "University of Washington",
        description:
            "As a UX Design Intern for the University of Washington, I designed and built a site on Figma helping students manage the complex processes in student conduct. (Case study in progress)",
        image: "/images/projects/uw-conduct.png",
        href: "https://flint-speed-41513011.figma.site/",
        cursorNote: "project details coming. click to view demo!",
    },
    {
        id: "joykill",
        title: "JoyKill",
        category: "Product Design",
        timeline: "2024 - 2025",
        role: "Product Designer",
        team: "Solo Project",
        description:
            "Reimagining the horror genre through designing a femme-horror film festival. (Link to old site)",
        image: "/images/projects/joykill.png",
        href: "https://audreyphan.xyz/joykill/",
        cursorNote:
            "project hasn't been transferred to the site you are on. view on old site!",
    },
    {
        id: "rentee",
        title: "Rentee",
        category: "Product Design",
        timeline: "2024 - 2025",
        role: "Product Designer",
        team: "Solo Project",
        description:
            "Helping renters understand and access their tenant rights through a more centralized, inclusive,  and accessible app. (Link to old site)",
        image: "/images/projects/rentee.png",
        href: "https://audreyphan.xyz/rentee/",
        cursorNote:
            "project hasn't been transferred to the site you are on. view on old site!",
    },
]
