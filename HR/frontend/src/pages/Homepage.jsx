import Navbar from "../components/navbar";
import HeroSection from "../components/Sections/HeroSection";
import CareSection from "../components/Sections/CareSection";
import ServicesSection from "../components/Sections/ServicesSection";
import HiringSection from "../components/Sections/HiringSection";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 relative">
      <main>
        <Navbar />
        <HeroSection />
        <HiringSection />
        <ServicesSection />
        <CareSection />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
