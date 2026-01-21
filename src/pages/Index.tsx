import { useState } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';
import { SimulatorPage } from '@/components/simulator/SimulatorPage';

const Index = () => {
  const [showSimulator, setShowSimulator] = useState(false);

  if (showSimulator) {
    return <SimulatorPage />;
  }

  return <LandingPage onStartSimulation={() => setShowSimulator(true)} />;
};

export default Index;
