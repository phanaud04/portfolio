import AudreyHeadline from "./AudreyHeadline"
import TextCycler from "./TextCycler"
import "./Hero.css"

const SUBHEADING_TEXTS = [
    "Design Intern @ Centene (Fortune 19)",
    "New Grad (UW Informatics '26)",
    "Seattlelite with Big Dreams",
]

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-inner">
                <AudreyHeadline />
                <p className="hero-subheading">
                    <TextCycler texts={SUBHEADING_TEXTS} />
                </p>
            </div>
        </section>
    )
}
