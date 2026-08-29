import CaseStudySectionNav, {
    type CaseStudySection,
} from "../components/CaseStudySectionNav"
import CaseStudyNextProject from "../components/CaseStudyNextProject"
import GradientCtaButton from "../components/GradientCtaButton"
import FeatureUsagePieChart from "../components/FeatureUsagePieChart"
import Carousel from "../components/Carousel"
import FractionStatRow from "../components/FractionStatRow"
import ViewCredits from "../components/ViewCredits"
import useCaseStudyReveal from "../hooks/useCaseStudyReveal"
import "../styles/caseStudy.css"

const RESEARCH_STATS = [
    {
        numerator: 3,
        denominator: 5,
        body: "participants are active users of the WSDOT app.",
    },
    {
        numerator: 5,
        denominator: 5,
        body: "found the current design of the interface unappealing.",
    },
    {
        numerator: 4,
        denominator: 5,
        body: "said the way information is displayed and communicated is confusing.",
    },
]

const PROBLEM_SLIDES = [
    {
        src: "/images/wsdot/problem_home_traffic.png",
        alt: "Annotated home screen and traffic map screens: home screen is a long list of pages, inconsistent icon sizing and confusing symbols, too many buttons going to different pages",
    },
    {
        src: "/images/wsdot/problem_ferries.png",
        alt: "Annotated ferries screens: excessive list-style navigation throughout the app, no arrival times or enough context for travelers",
    },
]

const DESIGN_DECISION_SLIDES = [
    {
        src: "/images/wsdot/decisions_before.png",
        alt: "Design decisions: before screens",
    },
    {
        src: "/images/wsdot/decisions_after.png",
        alt: "Design decisions: after screens",
    },
]

const SECTIONS: CaseStudySection[] = [
    { id: "overview", label: "Overview" },
    { id: "problem-context", label: "Problem Context" },
    { id: "solution-overview", label: "Solution Overview" },
    { id: "user-research", label: "User Research" },
    { id: "scoping-iteration", label: "Scoping & Iteration" },
    { id: "final-solution", label: "Final Solution" },
    { id: "recognition", label: "Recognition" },
    { id: "conclusion", label: "Conclusion" },
]

const FEATURES = [
    {
        star: "★",
        color: "#2563EB",
        title: "New Navigation System",
        body: "Navigation integrated into the flow of the app itself instead of living on the homepage as a list.",
    },
    {
        star: "★",
        color: "#15803D",
        title: "Legend and Icons",
        body: "Less detailed icon designs for better visibility, plus a map legend for more context.",
    },
    {
        star: "★",
        color: "#92400E",
        title: "Ferries",
        body: "A UI refresh giving users more context around each ferry.",
    },
    {
        star: "★",
        color: "#A14FCC",
        title: "My Routes",
        body: "Letting users input frequent routes to access key information fast.",
    },
]

const TAKEAWAYS = [
    {
        quote: "Validate the problem before you solve it",
        support:
            "Grounding the solution in early research and choosing a space we cared about made the difference: uncertainty in the early stages went away after the first interview confirmed we were solving something real.",
    },
    {
        quote: "In-person, open conversation drives better ideas",
        support:
            "As a team, we worked best in person: casual, open conversations produced our best ideas.",
    },
    {
        quote: "Don't get attached to ideas too early",
        support:
            "I noticed myself holding onto designs that weren't working during wireframing. Team voting helped me step back and let go faster.",
    },
]

export default function WsdotCaseStudy() {
    useCaseStudyReveal()

    return (
        <main className="case-page">
            <CaseStudySectionNav sections={SECTIONS} />

            <header className="case-hero">
                <div className="case-hero-top">
                    <div className="case-hero-title-wrap">
                        <p className="case-eyebrow">
                            WSDOT: Washington State Department of
                            Transportation
                        </p>
                        <h1 className="case-hero-title">
                            Improving commuters' travel experiences through
                            redesigning WSDOT's IOS app
                        </h1>
                    </div>
                    <GradientCtaButton targetId="solution-overview">
                        Jump to Solution
                    </GradientCtaButton>
                </div>

                <div className="case-hero-image">
                    <video
                        src="/images/wsdot/hero.mp4"
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
                            Lead Product Designer
                            <br />
                            UX Researcher
                        </p>
                    </div>
                    <div>
                        <p className="case-meta-label">Team</p>
                        <p className="case-meta-value">
                            <ViewCredits
                                lines={[
                                    "Keilani Uehara (Product Manager)",
                                    "Audrey Phan (Lead Product Designer)",
                                    "Arohee Kumar (Developer)",
                                    "Jules Braun (Developer)",
                                    "Daniel Bejar (Developer)",
                                ]}
                            />
                            <br />
                            iDOT (Capstone)
                            <br />
                            Read about us{" "}
                            <a
                                className="case-link-highlight"
                                href="https://ischool.uw.edu/news/2026/05/informatics-team-helps-get-wsdots-app-gear"
                                target="_blank"
                                rel="noreferrer"
                            >
                                here
                            </a>
                        </p>
                    </div>
                    <div>
                        <p className="case-meta-label">Timeline</p>
                        <p className="case-meta-value">January – June</p>
                    </div>
                    <div>
                        <p className="case-meta-label">Skills</p>
                        <p className="case-meta-value">
                            User Research
                            <br />
                            Prototyping
                            <br />
                            Feature Scoping
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
                    <p className="case-stat-number">500K+</p>
                    <p className="case-stat-label">App users</p>
                </div>
                <div className="case-stat">
                    <p className="case-stat-number">30%</p>
                    <p className="case-stat-label">
                        Task completion increase
                    </p>
                </div>
                <div className="case-stat">
                    <p className="case-stat-number">1st</p>
                    <p className="case-stat-label">
                        Place at iSchool showcase
                    </p>
                </div>
            </div>

            <section id="overview" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Overview</p>
                    <h2 className="case-heading">
                        A redesign of the Washington State Department of
                        Transportation (WSDOT) iOS app (~500K+ downloads) to
                        modernize how Washington travelers access real-time
                        traffic, ferry, and road condition data.
                    </h2>
                    <p className="case-body">
                        I owned the ferry feature, the app's most used and
                        previously lowest-rated feature, end-to-end,
                        reducing time-to-key-information for ferry
                        schedules, statuses, and alerts.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/banner.png"
                            alt="Washington State Department of Transportation"
                        />
                    </div>
                </div>
            </section>

            <section id="problem-context" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Problem Space</p>
                    <h2 className="case-heading">
                        WSDOT's IOS app hasn't been updated in 7 years.
                    </h2>
                    <p className="case-body">
                        The app's cluttered interface and poor information
                        hierarchy make it hard for users to quickly access
                        critical travel data.
                    </p>
                    <Carousel slides={PROBLEM_SLIDES} />
                </div>

                <div className="case-block">
                    <div className="case-image" style={{ marginTop: 0 }}>
                        <img
                            src="/images/wsdot/bad_reviews.jpg"
                            alt="Two critical App Store reviews about the ferries feature"
                        />
                    </div>
                </div>

                <div className="case-block case-quote-box">
                    <p className="case-eyebrow">The Challenge</p>
                    <p>
                        "How might WSDOT iOS app users achieve a more
                        accessible and intuitive experience in the app so
                        that they can make more informed decisions
                        surrounding transportation?"
                    </p>
                </div>
            </section>

            <section id="solution-overview" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Solution Overview</p>
                    <h2 className="case-heading">
                        Overhauled information architecture and UI hierarchy
                    </h2>
                    <p className="case-body">
                        Over the course of 2 quarters (6 months), we
                        conducted research, redesigned the navigation,
                        traffic maps, ferries, and routes features, and
                        refined through multiple rounds of stakeholder
                        testing.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/other_solutions.png"
                            alt="Redesigned home navigation, map legend, and route alerts screens"
                        />
                    </div>
                </div>
            </section>

            <section id="user-research" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Where it all began</p>
                    <h2 className="case-heading">
                        Majority of the stakeholders we interviewed struggled
                        navigating the app.
                    </h2>
                    <p className="case-body">
                        During our first 2 months dedicated to research, we
                        interviewed 5 Washington State commuters. Some key
                        problems we found were difficulty discovering certain
                        features and getting lost in the navigation.
                    </p>
                    <FractionStatRow stats={RESEARCH_STATS} />
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Surveys</p>
                    <h2 className="case-heading">
                        Survey with ~35 responses identified most used app
                        features and key pain points
                    </h2>
                    <p className="case-body">
                        Quantified data helped us scope our solution.
                    </p>
                    <div
                        className="case-image"
                        style={{
                            padding: "32px 16px",
                            background: "#fafafa",
                        }}
                    >
                        <FeatureUsagePieChart />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Competitive Analysis</p>
                    <h2 className="case-heading">Uncovering Market Gaps</h2>
                    <p className="case-body">
                        I looked at 5 highly rated transportation apps and 5
                        articles surrounding transportation mobile apps,
                        which informed accessibility as a P0 change.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/competitors.jpg"
                            alt="Competitive analysis of FerryFriend, Citymapper, OneBusAway, and MDOT Traffic"
                        />
                    </div>
                </div>
            </section>

            <section id="scoping-iteration" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Feature Scoping</p>
                    <h2 className="case-heading">
                        Finding common themes across data and turning those
                        into key features
                    </h2>
                    <p className="case-body">
                        One survey and Reddit post, 5 stakeholder interviews,
                        25 literature reviews, and 25 competitive analyses
                        later. We pulled consistent insights and ranked them
                        together.
                    </p>
                    <div className="case-feature-grid">
                        {FEATURES.map((f) => (
                            <div className="case-feature-card" key={f.title}>
                                <p className="case-feature-card-title">
                                    <span
                                        className="star"
                                        style={{ color: f.color }}
                                    >
                                        {f.star}
                                    </span>
                                    {f.title}
                                </p>
                                <p>{f.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Low-Fi Prototyping</p>
                    <h2 className="case-heading">
                        Rebuilding from the ground up
                    </h2>
                    <p className="case-body">
                        WSDOT had no pre-existing design system or Figma
                        file, so low-fi prototyping meant building both the
                        interface concepts and assets from scratch.
                    </p>
                    <div className="case-image case-image--framed">
                        <img
                            src="/images/wsdot/lofi_prototypes.png"
                            alt="Low-fidelity wireframes for Home/Map, My Routes, and Ferries"
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Design Decisions</p>
                    <h2 className="case-heading">
                        Narrowing our focus: what stayed and what we cut out
                    </h2>
                    <p className="case-body">
                        Our initial prototype went through multiple rounds of
                        testing with real users and WSDOT staff, surfacing
                        bigger issues that took priority over changes we'd
                        originally planned. Additionally, WSDOT managers
                        added new constraints we had to work with.
                    </p>
                    <Carousel slides={DESIGN_DECISION_SLIDES} />
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">User Testing</p>
                    <h2 className="case-heading">
                        In our mid-fi designs, we found there was no feature
                        discoverability due to bad navigation flow
                    </h2>
                    <p className="case-body">
                        Testing revealed navigation was users' biggest pain
                        point. Too many page options made the app feel
                        disorienting and hard to move through.
                    </p>
                    <div className="case-image">
                        <video
                            src="/images/wsdot/mid_fi_navigation.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">User Testing</p>
                    <h2 className="case-heading">
                        In Ferries, outdated design, unclear naming, and a
                        disjointed flow left users unsure what to click or
                        where it would take them
                    </h2>
                    <p className="case-body">
                        My first attempt over-corrected with more pages,
                        echoing the app's larger navigation issue.
                    </p>
                    <div className="case-image">
                        <video
                            src="/images/wsdot/mid_fi_ferries.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>
            </section>

            <section id="final-solution" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Outcome</p>
                    <h2 className="case-heading">
                        The final ferries prototype showed a 30% increase in
                        task completion during the last round of user
                        testing
                    </h2>
                    <p className="case-body">
                        Early testing = 70% task completion, final testing =
                        100% task completion.
                    </p>
                    <p className="case-body" style={{ marginTop: 16 }}>
                        The redesign is projected to improve the experience
                        for the app's most-used, lowest-rated feature across
                        500K+ users.
                    </p>
                    <div className="case-video-panel">
                        <video
                            src="/images/wsdot/final_ferry_flow.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Other Features</p>
                    <h2 className="case-heading">
                        New icons, streamlined alerts, and personalized
                        features.
                    </h2>
                    <p className="case-body">
                        I contributed to other key features such as
                        designing icons and a legend for accessibility,
                        making alerts more discoverable, and adding more
                        customization features throughout the app.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/other_solutions.png"
                            alt="Additional feature screens: icons, alerts, and customization options"
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Handoff</p>
                    <h2 className="case-heading">
                        We delivered a design system, component library,
                        redlines, and written specs to our developers, and
                        documented key design decisions for WSDOT
                        stakeholders.
                    </h2>
                </div>
            </section>

            <section id="recognition" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Recognition</p>
                    <h2 className="case-heading">
                        1st place for Equity and Insightfulness awards at the
                        2026 iSchool showcase out of 312 other teams.
                    </h2>
                    <p className="case-body">
                        Judges tested our product and awarded us 1st place
                        for Bridge-Builder (Equity) and Visionary Lens
                        (Insightfulness), plus a placement for Spark
                        (Creativity), one of only two teams to place in all
                        three categories.
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/showcase_award.avif"
                            alt="Photo from the 2026 iSchool showcase award presentation"
                        />
                    </div>
                </div>

                <div className="case-block">
                    <p className="case-eyebrow">Newsletter Feature</p>
                    <h2 className="case-heading">
                        Chosen as the only undergraduate capstone project to
                        be featured in iSchool's newsletter.
                    </h2>
                    <p className="case-body">
                        Out of about 70 undergraduate capstone teams, we
                        were chosen to have our project and impact featured
                        on the newsletter to represent the iSchool's
                        accomplishments. Read the article{" "}
                        <a
                            className="case-link-highlight"
                            href="https://ischool.uw.edu/news/2026/05/informatics-team-helps-get-wsdots-app-gear"
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>
                        .
                    </p>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/newsletter_pic.avif"
                            alt="iSchool newsletter feature photo"
                        />
                    </div>
                </div>
            </section>

            <section id="conclusion" className="case-section">
                <div className="case-block">
                    <p className="case-eyebrow">Key Takeaways</p>
                    <ol className="case-takeaways">
                        {TAKEAWAYS.map((t, i) => (
                            <li key={t.quote}>
                                <span className="num">
                                    0{i + 1}
                                </span>
                                <div>
                                    <p className="quote">{t.quote}</p>
                                    <p className="support">{t.support}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="case-image">
                        <img
                            src="/images/wsdot/newsletter_pic2.avif"
                            alt="Team photo from the capstone showcase"
                        />
                    </div>
                </div>
            </section>

            <CaseStudyNextProject
                to="/bits"
                video="/images/bits/hero.mp4"
                title="BITS"
            />
        </main>
    )
}
