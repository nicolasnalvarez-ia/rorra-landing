import type { SiteContent } from "@/lib/content";
import RevealObserver from "@/components/landing/RevealObserver";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import About from "@/components/landing/About";
import Stats from "@/components/landing/Stats";
import Services from "@/components/landing/Services";
import Portfolio from "@/components/landing/Portfolio";
import Contact from "@/components/landing/Contact";

export default function Landing({ content }: { content: SiteContent }) {
  // One cover photo per service row for the cursor-following preview.
  const covers = [content.hero.image2, content.sobreMi.image, content.hero.image1, ...content.galeria.map((g) => g.photos[0])].filter(
    Boolean
  );
  const previews = content.servicios.map((_, i) => covers[i % covers.length]);

  return (
    <div className="site">
      <RevealObserver />
      <Nav />
      <main>
        <Hero hero={content.hero} />
        <Marquee />
        <About sobreMi={content.sobreMi} />
        <Stats />
        <Services servicios={content.servicios} previews={previews} />
        <Portfolio galeria={content.galeria} />
      </main>
      <Contact />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
