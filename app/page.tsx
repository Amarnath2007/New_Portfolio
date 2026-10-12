import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StarsBg from "@/components/StarsBg";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <StarsBg />
      <Navbar />
      <Hero />
      <Skills />
      <Achievements />
      <Certifications />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
