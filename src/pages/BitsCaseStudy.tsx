import CaseStudySectionNav, {
    type CaseStudySection,
} from "../components/CaseStudySectionNav"
import CaseStudyNextProject from "../components/CaseStudyNextProject"
import GradientCtaButton from "../components/GradientCtaButton"
import FractionStatRow from "../components/FractionStatRow"
import ViewCredits from "../components/ViewCredits"
import useCaseStudyReveal from "../hooks/useCaseStudyReveal"
import "../styles/caseStudy.css"

const RESEARCH_STATS = [
    {
        numerator: 7,
        denominator: 10,
        body: "said the cost of living in Seattle leads them to prioritize financially rewarding projects.",
    },
    {
        numerator: 10,
        denominator: 10,
        body: "said Seattle provides opportunities for creativity and self-expression.",
    },
    {
        numerator: 4,
        denominator: 10,
        body: "have experienced the “Seattle Freeze” (difficulty finding community in Seattle).",
    },
]

const SECTIONS: CaseStudySection[] = [
    { id: "overview", label: "Overview" },
    { id: "problem-context", label: "Problem Context" },
    { id: "solution-overview", label: "Solution Overview" },
    { id: "user-research", label: "User Research" },
    { id: "scoping-iteration", label: "Scoping & Iteration" },
    { id: "final-solution", label: "Final Solution" },
    { id: "execution", label: "Execution" },
    { id: "what-i-learned", label: "What I Learned" },
]

const TAKEAWAYS = [
    {
        quote: "Letting research drive feature prioritization",
        support:
            "When scoping FRIEND OR FOE?, I had to decide what made the cut for MVP. The research made design decisions easier: users valued community and connection above all else. The map of Seattle projects became the core feature rather than a nice-to-have. Having a clear research foundation made those calls easier to stick to. Next time, I'd leverage research even more.",
    },
    {
        quote: "Wearing multiple hats is a weird fashion choice, but also a skill",
        support:
            "Working across research, writing, and design simultaneously within a tight academic timeline was challenging, but looking back, it improved my ability to context-switch without losing quality in any one area.",
    },
    {
        quote: "If I were to do it again…",
        support:
            "I'd advocate earlier for a shared design system so the handoff between the magazine and app work-streams was more organized. Our product being multi-platform was a key strength, but some potential may have been lost by not designing the two sides closer with each other.",
    },
]

export default function BitsCaseStudy() {
    useCaseStudyReveal()

    return (
        <main className="case-page">
            <CaseStudySectionNav sections={SECTIONS} />

            <header className="case-hero">
                <div className="case-hero-top">
                    <div className="case-hero-title-wrap">
                        <p className="case-eyebrow">
                            BITS / Born in the Sound
                        </p>
                        <h1 className="case-hero-title">
                            Storytelling Seattle creatives' unique
                            experiences and challenges with a magazine and
                            app companion
                        </h1>
                    </div>
                    <GradientCtaButton targetId="solution-overview">
                        Jump to Solution
                    </GradientCtaButton>
                </div>

                <div className="case-hero-image">
                    <video
                        src="/images/bits/hero.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>

                <div className="case-meta-row">
                    <div>
                        <p className="case-meta-label">Role</p>
                        <p className="case-meta-value">
                            Product Designer
                            <br />
                            UX Researcher
                            <br />
                            Editorial Writer
                        </p>
                    </div>
                    <div>
                        <p className="case-meta-label">Team</p>
                        <p className="case-meta-value">
                            <ViewCredits
                                lines={[
                                    "Lead Product Designer",
                                    "Katrina Ngor",
                                    "",
                                    "Product Designers",
                                    "Audrey Phan, Cleo Yumei, Iris Hamilton, Tim Shim, Maya Gillaspy, Simra Jahin",
                                ]}
                            />
                            <br />
                            IM $TACKED
                        </p>
                    </div>
                    <div>
                        <p className="case-meta-label">Timeline</p>
                        <p className="case-meta-value">
                            November – May (7 months)
                        </p>
                    </div>
                    <div>
                        <p className="case-meta-label">Skills</p>
                        <p className="case-meta-value">
                            User Research
                            <br />
                            Editorial Writing
                            <br />
                            Prototyping
                            <br />
                            Usability Testing
                            <br />
                            Present / Pitch
                        </p>
                    </div>
                </div>
            </header>

            <div className="case-stats">
                <div className="case-stat">
                    <p className="case-stat-number">7</p>
                    <p className="case-stat-label">Person team</p>
                </div>
                <div className="case-stat">
                    <p className="case-stat-number">10</p>
                    <p className="case-stat-label">Creatives interviewed</p>
                </div>
                <div className="case-stat">
                    <p className="case-stat-number">2025</p>
                    <p className="case-stat-label">
                        Design for America Showcase
                    </p>
                </div>
            </div>

            <section id="overview" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Overview</p>
                    <h2 className="case-heading">
                        BITS is an interactive magazine and app built to
                        amplify Seattle's creative community, designed by a
                        student team of 7.
                    </h2>
                    <p className="case-body">
                        I owned two app experiences end-to-end, from user
                        interviews through final UI, that shed light on the
                        challenges of being a creative in Seattle.
                    </p>
                    <div className="case-image">
                        <video
                            src="/images/bits/overview.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>
            </section>

            <section id="problem-context" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Problem Space</p>
                    <h2 className="case-heading">
                        Seattle's creative scene is thriving, but its
                        artists aren't.
                    </h2>
                    <p className="case-body">
                        Rising costs of studio spaces, inaccessible funding,
                        and platforms built for consumers rather than
                        creators are leaving their stories untold.
                    </p>
                    <div className="case-image">
                        <video
                            src="/images/bits/problem.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>

                <div className="case-block case-quote-box case-quote-box--pink">
                    <p className="case-eyebrow">The Challenge</p>
                    <p>
                        "How might we elevate Seattle's creative voices
                        while providing visibility and awareness of
                        underlying issues?"
                    </p>
                </div>
            </section>

            <section id="solution-overview" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Solution Overview</p>
                    <h2 className="case-heading">
                        We designed a magazine that tells you the untold
                        stories of Seattle creatives
                    </h2>
                    <p className="case-body">
                        Turning their real stories into a readable and
                        shareable experience that brings awareness to their
                        craft, lives, and struggles in Seattle.
                    </p>
                    <div className="case-image">
                        <video
                            src="/images/bits/solution_preview_1.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                    <div className="case-video-panel case-video-panel--dark">
                        <video
                            src="/images/bits/solution_preview_2.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>
            </section>

            <section id="user-research" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">
                        Interviews & Card Sorting
                    </p>
                    <h2 className="case-heading">
                        Interviewed 10 Seattle creatives to understand what
                        they actually care about
                    </h2>
                    <p className="case-body">
                        Ran card sorting sessions with each participant,
                        sorting a set of cards from most important to them
                        (S-tier) to least important (D-tier).
                    </p>
                    <FractionStatRow stats={RESEARCH_STATS} />
                    <div
                        className="case-image case-image--sharp"
                        style={{ marginTop: 48 }}
                    >
                        <img
                            src="/images/bits/card_sort.avif"
                            alt="Card sorting results across interview participants"
                        />
                    </div>
                    <div
                        className="case-quote-box case-quote-box--accent"
                        style={{ marginTop: 48 }}
                    >
                        <p className="case-eyebrow">Key Insight</p>
                        <p>
                            Living in Seattle inspires creatives, yet
                            isolates them at the same time.
                        </p>
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Thematic Analysis</p>
                    <h2 className="case-heading">
                        Themes to organize research insights, with
                        editorials diving deep into each theme
                    </h2>
                    <p className="case-body">
                        My editorial, "FRIEND OR FOE?", written for the
                        technology theme, explores whether tech innovation
                        fuels artistic growth or undermines the authenticity
                        of Seattle's creativity.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/bits/themes.avif"
                            alt="Thematic analysis organizing research insights into editorial themes"
                        />
                    </div>
                </div>
            </section>

            <section id="scoping-iteration" className="case-section">
                <div className="case-block" style={{ marginBottom: 20 }}>
                    <p className="case-eyebrow">App Research</p>
                    <h2 className="case-heading">
                        Targeting opportunities through uncovering market
                        gaps and setting clear goals for the app's user
                        experience
                    </h2>
                    <div className="case-image">
                        <img
                            src="/images/bits/market.png"
                            alt="Market research uncovering gaps for a creative-storytelling app"
                        />
                    </div>
                    <div className="case-image" style={{ marginTop: 12 }}>
                        <img
                            src="/images/bits/uxhouse.png"
                            alt="UX house diagram setting goals for the app's user experience"
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Iteration</p>
                    <h2 className="case-heading">
                        From information to exploration
                    </h2>
                    <p className="case-body">
                        Some things didn't work. By shifting from a static
                        list to a spatial interface, the user goes from
                        being a passive reader to an active explorer.
                    </p>
                    <div className="case-compare-grid">
                        <div className="case-compare-card case-compare-card--before">
                            <img
                                src="/images/bits/discovery_before.png"
                                alt="Before: a text-heavy list of tech and art pieces"
                            />
                            <p className="case-compare-tag">
                                <span className="num">01</span> Before
                            </p>
                            <p className="case-compare-headline">
                                Cognitive overload
                            </p>
                            <ul className="case-list">
                                <li>
                                    Every entry had to be scanned just to
                                    find what was nearby.
                                </li>
                                <li>
                                    A wall of text, on top of an already
                                    text-heavy magazine.
                                </li>
                            </ul>
                        </div>
                        <div className="case-compare-card case-compare-card--after">
                            <img
                                src="/images/bits/discovery_after.png"
                                alt="After: an interactive map with pinpoints for tech and art pieces"
                            />
                            <p className="case-compare-tag">
                                <span className="num">02</span> After
                            </p>
                            <p className="case-compare-headline">
                                Contextual discovery
                            </p>
                            <ul className="case-list">
                                <li>
                                    An interactive map with pins users can
                                    tap into.
                                </li>
                                <li>
                                    Less reading, more exploring: the
                                    directory becomes intuitive.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="final-solution" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Final Solution</p>
                    <h2 className="case-heading">
                        BITS, or Born In the Sound: elevating Seattle
                        creatives' voices
                    </h2>
                    <p className="case-body">
                        Shedding light on their struggles through immersive
                        storytelling and interactive experiences.
                    </p>
                    <div className="case-image">
                        <video
                            src="/images/bits/final_solution_1.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                    <div className="case-image">
                        <video
                            src="/images/bits/final_solution_2.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Key Feature</p>
                    <h2 className="case-heading">
                        Tech & Art Intersection Map
                    </h2>
                    <p className="case-body">
                        My app for the editorial "FRIEND OR FOE?" included
                        an interactive map with Seattle installations that
                        exist at the intersection of technology and art.
                    </p>
                    <div className="case-media-row">
                        <div className="iphone-frame">
                            <span className="iphone-frame-island" />
                            <span className="iphone-frame-btn iphone-frame-btn--action" />
                            <span className="iphone-frame-btn iphone-frame-btn--vol-up" />
                            <span className="iphone-frame-btn iphone-frame-btn--vol-down" />
                            <span className="iphone-frame-btn iphone-frame-btn--power" />
                            <span className="iphone-frame-btn iphone-frame-btn--camera" />
                            <video
                                src="/images/bits/techandart.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                        <div className="case-list-panel">
                            <ul className="case-list">
                                <li>
                                    Spotlights the places in Seattle where
                                    cutting-edge innovation meets artistic
                                    expression.
                                </li>
                                <li>
                                    Shows that technology and art can
                                    coexist in spaces and even uplift each
                                    other.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Key Feature</p>
                    <h2 className="case-heading">
                        Cost of Living Simulator
                    </h2>
                    <p className="case-body">
                        My app for the editorial "Cost of Creation"
                        included a simulation of your spending if you were
                        a creative.
                    </p>
                    <div className="case-media-row">
                        <div className="iphone-frame">
                            <span className="iphone-frame-island" />
                            <span className="iphone-frame-btn iphone-frame-btn--action" />
                            <span className="iphone-frame-btn iphone-frame-btn--vol-up" />
                            <span className="iphone-frame-btn iphone-frame-btn--vol-down" />
                            <span className="iphone-frame-btn iphone-frame-btn--power" />
                            <span className="iphone-frame-btn iphone-frame-btn--camera" />
                            <video
                                src="/images/bits/costofcreate.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                        <div className="case-list-panel">
                            <ul className="case-list">
                                <li>
                                    Allows users to experience how
                                    different spending choices lead to
                                    different outcomes.
                                </li>
                                <li>
                                    A lose-lose outcome designed to make
                                    users feel, rather than only read
                                    about, the financial barriers artists
                                    face.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="execution" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Execution</p>
                    <h2 className="case-heading">
                        The only team with a multi-platform product,
                        bridging physical and digital design
                    </h2>
                    <p className="case-body">
                        We demoed at the 2025 Design for America Showcase
                        to a panel of UX researchers and product designers.
                        Magazine copies were distributed to the audience
                        with QR codes that pulled up the app on their
                        devices.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/bits/expo.avif"
                            alt="Showcase demo at the 2025 Design for America Showcase"
                        />
                    </div>
                </div>
            </section>

            <section id="what-i-learned" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">What I Learned</p>
                    <ol className="case-takeaways">
                        {TAKEAWAYS.map((t, i) => (
                            <li key={t.quote}>
                                <span className="num">0{i + 1}</span>
                                <div>
                                    <p className="quote">{t.quote}</p>
                                    <p className="support">{t.support}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="case-image">
                        <img
                            src="/images/bits/firstmeeting.avif"
                            alt="The team's first meeting"
                        />
                    </div>
                </div>
            </section>

            <CaseStudyNextProject
                to="/wsdot"
                video="/images/wsdot/hero.mp4"
                title="WSDOT"
            />
        </main>
    )
}
