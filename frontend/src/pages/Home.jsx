import React from "react";
import Hero from "../components/Hero";
import ClaimsStrip from "../components/ClaimsStrip";
import FlavourGrid from "../components/FlavourGrid";
import ThreePillars from "../components/ThreePillars";
import FounderScroll from "../components/FounderScroll";
import BundleUpsell from "../components/BundleUpsell";
import Reviews from "../components/Reviews";

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <ClaimsStrip />
      <FlavourGrid />
      <ThreePillars />
      <FounderScroll />
      <BundleUpsell />
      <Reviews />
    </div>
  );
}
