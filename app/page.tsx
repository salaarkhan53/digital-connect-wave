import { Hero } from '@/components/home/Hero';
import { ComplianceBar } from '@/components/home/ComplianceBar';
import { ProofMarquee } from '@/components/home/ProofMarquee';
import { StatRow } from '@/components/home/StatRow';
import { Capabilities } from '@/components/home/Capabilities';
import { Measured } from '@/components/home/Measured';
import { Industries } from '@/components/home/Industries';
import { SavingsCalculator } from '@/components/home/SavingsCalculator';
import { Process } from '@/components/home/Process';
import { Principles } from '@/components/home/Principles';
import { Coverage } from '@/components/home/Coverage';
import { CareersTeaser } from '@/components/home/CareersTeaser';
import { CTABand } from '@/components/ui/CTABand';

export default function HomePage() {
  return (
    <>
      {/* dark — hero, the objection, the ticker */}
      <Hero />
      <ComplianceBar />
      <ProofMarquee />

      {/* light — the proof and the offer */}
      <StatRow />
      <Capabilities />

      {/* dark — accountability and verticals */}
      <Measured />
      <Industries />

      {/* light — the interactive moment, the method, the rules */}
      <SavingsCalculator />
      <Process />
      <Principles />

      {/* dark — coverage, people, close */}
      <Coverage />
      <CareersTeaser />
      <CTABand />
    </>
  );
}
