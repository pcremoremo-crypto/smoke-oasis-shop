import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CollectionsSection } from "@/components/CollectionsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CollectionsSection />
      <Footer />
    </div>
  );
};

export default Index;
