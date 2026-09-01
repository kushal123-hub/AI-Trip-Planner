import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import BrandMarquee from "../components/BrandMarquee";
import DestinationsSection from "../components/DestinationsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TripPlannerSection from "../components/TripPlannerSection";
import FeaturesSection from "../components/FeaturesSection";
import ItineraryPreviewSection from "../components/ItineraryPreviewSection";
import FinalCTASection from "../components/FinalCTASection";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [preloadedData, setPreloadedData] = useState(null);
  const [activeItinerary, setActiveItinerary] = useState(null);

  const scrollToPlanner = () => {
    const el = document.getElementById("planner");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToDestinations = () => {
    const el = document.getElementById("destinations");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectDestination = (dest) => {
    setPreloadedData(dest);
    scrollToPlanner();
  };

  const handleItineraryGenerated = (data) => {
    setActiveItinerary(data);
    setTimeout(() => {
      const el = document.getElementById("itinerary-preview");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#181b22] text-[#EAEAEA] selection:bg-[#FF2E63]/30 selection:text-[#FF2E63]">
      {/* 1. Hero Section */}
      <HeroSection 
        onStartPlanning={scrollToPlanner} 
        onExploreDestinations={scrollToDestinations} 
      />

      {/* Infinite Tech & Partners Marquee */}
      <BrandMarquee />

      {/* 2. Destinations Showcase */}
      <DestinationsSection 
        onSelectDestination={handleSelectDestination} 
      />

      {/* 3. How It Works Section */}
      <HowItWorksSection 
        onGetStarted={scrollToPlanner} 
      />

      {/* 4. AI Trip Planner Multi-Step Wizard & 5. AI Generation Experience */}
      <TripPlannerSection 
        preloadedData={preloadedData}
        onItineraryGenerated={handleItineraryGenerated}
      />

      {/* 6. Features Bento Grid */}
      <FeaturesSection />

      {/* 7. Itinerary Preview / Showcase Section */}
      <ItineraryPreviewSection 
        activeItineraryData={activeItinerary}
        onSelectDestination={handleSelectDestination}
      />

      {/* 8. Final Call to Action */}
      <FinalCTASection 
        onStartPlanning={scrollToPlanner} 
      />

      {/* 9. Minimal Modern Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
