import Hero from "./Hero";
import TrustBar from "./TrustBar";
import ProblemHook from "./ProblemHook";
import WhatIs from "./WhatIs";
import Benefits from "./Benefits";
import Comparison from "./Comparison";
import HowToUse from "./HowToUse";
import Economy from "./Economy";
import Origin from "./Origin";
import NutritionSpecs from "./NutritionSpecs";
import Kits from "./Kits";
import Safety from "./Safety";
import Faq from "./Faq";
import FinalCta from "./FinalCta";
import StickyCta from "./StickyCta";

export default function ProductPage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProblemHook />
      <WhatIs />
      <Benefits />
      <Comparison />
      <HowToUse />
      <Economy />
      <Origin />
      <NutritionSpecs />
      <Kits />
      <Safety />
      <Faq />
      <FinalCta />
      <StickyCta />
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
