import { Link, useLocation } from "react-router-dom"
import "./Nav.css"

const NAV_ITEMS = [
    { label: "work", href: "/", isActive: (path: string) => path === "/" || path === "/wsdot" },
    { label: "play", href: "/play", isActive: (path: string) => path === "/play" },
    { label: "about", href: "/about", isActive: (path: string) => path === "/about" },
] as const

export default function Nav() {
    const { pathname } = useLocation()

    return (
        <>
            <nav className="nav-wrap" aria-label="Primary">
                <div className="nav-pill">
                    {NAV_ITEMS.map((item) => {
                        const active = item.isActive(pathname)
                        const className =
                            "nav-item" + (active ? " nav-item--active" : "")
                        return (
                            <Link
                                key={item.label}
                                to={item.href}
                                className={className}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <Link to="/" aria-label="Audrey Phan, home">
                <img
                    className="logo"
                    src="/images/logo.png"
                    alt="Audrey Phan"
                />
            </Link>
        </>
    )
}
