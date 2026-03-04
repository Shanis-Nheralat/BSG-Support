import type { Metadata } from 'next';
import CalculatorClient from './CalculatorClient';

export const metadata: Metadata = {
  title: 'Team Efficiency Calculator | Backsure Global Support',
  description:
    'Calculate your team efficiency savings with BSG. Discover how outsourcing operational tasks can reduce costs and improve productivity for your insurance or finance team.',
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
