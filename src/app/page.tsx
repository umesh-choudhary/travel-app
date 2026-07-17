import { cookies } from 'next/headers';
import Hero from './landing/Hero';
import Features from './landing/Features';
import About from './landing/About';
import Contact from './landing/Contact';
import Footer from './landing/Footer';
import LandingHeader from './landing/LandingHeader';

export default async function Home() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const isLoggedIn = !!sessionCookie;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-color/30 flex flex-col justify-between">
      <div>
        {/* Sticky Header Navigation */}
        <LandingHeader isLoggedIn={isLoggedIn} />

        {/* Modular Landing Sections */}
        <main>
          <Hero isLoggedIn={isLoggedIn} />
          <Features />
          <About />
          <Contact />
        </main>
      </div>

      <Footer />
    </div>
  );
}
