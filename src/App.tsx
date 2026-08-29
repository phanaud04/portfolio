import { Routes, Route } from "react-router-dom"
import Nav from "./components/Nav"
import CustomCursor from "./components/CustomCursor"
import ScrollToTop from "./components/ScrollToTop"
import Footer from "./components/Footer"
import { CaseStudyTransitionProvider } from "./components/CaseStudyTransition"
import Home from "./pages/Home"
import WsdotCaseStudy from "./pages/WsdotCaseStudy"
import BitsCaseStudy from "./pages/BitsCaseStudy"
import Play from "./pages/Play"
import About from "./pages/About"

export default function App() {
    return (
        <CaseStudyTransitionProvider>
            <CustomCursor />
            <ScrollToTop />
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wsdot" element={<WsdotCaseStudy />} />
                <Route path="/bits" element={<BitsCaseStudy />} />
                <Route path="/play" element={<Play />} />
                <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
        </CaseStudyTransitionProvider>
    )
}
