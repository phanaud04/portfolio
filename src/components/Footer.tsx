import { Link } from "react-router-dom"
import AsciiTrail from "./AsciiTrail"
import { CONTACT } from "../data/contact"
import "./Footer.css"

const NAV_LINKS = [
    { label: "work", to: "/" },
    { label: "play", to: "/play" },
    { label: "about", to: "/about" },
]

export default function Footer() {
    return (
        <footer className="site-footer">
            <AsciiTrail />
            <div className="site-footer-inner">
                <h2 className="site-footer-title">
                    <span>Let's</span>
                    <span>create</span>
                    <span>something</span>
                    <span>together.</span>
                </h2>
                <div className="site-footer-right">
                    <nav className="site-footer-links" aria-label="Footer navigation">
                        {NAV_LINKS.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="site-footer-link"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="site-footer-links">
                        <a
                            className="site-footer-link"
                            href={`mailto:${CONTACT.email}`}
                            aria-label="Email Audrey"
                        >
                            email
                        </a>
                        <a
                            className="site-footer-link"
                            href={CONTACT.linkedinHref}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="Audrey's LinkedIn"
                        >
                            linkedin
                        </a>
                        <a
                            className="site-footer-link"
                            href={CONTACT.resumeHref}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="Audrey's resume"
                        >
                            resume
                        </a>
                    </div>
                    <p className="site-footer-meta">
                        © {new Date().getFullYear()} Audrey Phan
                    </p>
                </div>
            </div>
        </footer>
    )
}
