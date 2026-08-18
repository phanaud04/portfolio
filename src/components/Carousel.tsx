import { useState } from "react"
import "./Carousel.css"

type Slide = {
    src: string
    alt: string
}

export default function Carousel({ slides }: { slides: Slide[] }) {
    const [index, setIndex] = useState(0)

    const goTo = (i: number) => setIndex((i + slides.length) % slides.length)

    return (
        <div className="carousel">
            <div className="carousel-viewport">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {slides.map((s) => (
                        <div className="carousel-slide" key={s.src}>
                            <img src={s.src} alt={s.alt} />
                        </div>
                    ))}
                </div>

                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="carousel-arrow carousel-arrow--prev"
                            aria-label="Previous slide"
                            onClick={() => goTo(index - 1)}
                        >
                            <svg
                                width="10"
                                height="16"
                                viewBox="0 0 10 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M9 1L1.5 8L9 15"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="carousel-arrow carousel-arrow--next"
                            aria-label="Next slide"
                            onClick={() => goTo(index + 1)}
                        >
                            <svg
                                width="10"
                                height="16"
                                viewBox="0 0 10 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M1 1L8.5 8L1 15"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {slides.length > 1 && (
                <div className="carousel-dots">
                    {slides.map((s, i) => (
                        <button
                            type="button"
                            key={s.src}
                            className={
                                "carousel-dot" +
                                (i === index ? " carousel-dot--active" : "")
                            }
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
