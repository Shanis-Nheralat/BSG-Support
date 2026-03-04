import React from 'react';
import './index.css';
import BSGHeader from './components/BSGHeader';
import BSGFooter from './components/BSGFooter';
import TeamEfficiencyCalculator from './components/TeamEfficiencyCalculator';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App flex flex-col min-h-screen">
        <BSGHeader />
        <main className="flex-1">
          <TeamEfficiencyCalculator />
        </main>
        <BSGFooter />
      </div>
    </ErrorBoundary>
  );
}

export default App;
