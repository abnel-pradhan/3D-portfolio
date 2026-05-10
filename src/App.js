import React, { useEffect, useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import AIChat from "./components/AIChat";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AmbientBG from "./components/AmbientBG";
import Marquee from "./components/Marquee";

const useIsMobile = () => {
  const [m, setM] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onR = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return m;
};

const Home = () => {
  const isMobile = useIsMobile();
  return (
    <div className="relative grain min-h-screen" data-testid="portfolio-root">
      <AmbientBG isMobile={isMobile} />
      <Navbar />
      <main className="relative z-10">
        <Hero isMobile={isMobile} />
        <Marquee />
        <About />
        <Projects />
        <Skills isMobile={isMobile} />
        <AIChat />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;