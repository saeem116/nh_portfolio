import { Header } from "../src/components/Header";
import { Hero } from "../src/components/Hero";
import { SelectedProjects } from "../src/components/SelectedProjects";
import { About } from "../src/components/About";
import { Workflow } from "../src/components/Workflow";
import { QuoteSection } from "../src/components/QuoteSection";
import { Contact } from "../src/components/Contact";
import { Footer } from "../src/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <SelectedProjects />
      <About />
      <Workflow />
      <QuoteSection />
      <Contact />
      <Footer />
    </main>
  );
}