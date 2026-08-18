import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// React Router's client-side navigation doesn't reset scroll position —
// clicking a Link while scrolled down (e.g. a case study's "Next Project"
// card at the very bottom of the page) lands on the new page still
// scrolled to that same pixel offset instead of at the top. This restores
// the expected "new page starts at the top" behavior on every route
// change, site-wide.
export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
