import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GovernmentJobs from './pages/GovernmentJobs';
import GovernmentTenders from './pages/GovernmentTenders';
import GovernmentFunding from './pages/GovernmentFunding';
import Contact from './pages/Contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'jobs':
        return <GovernmentJobs />;
      case 'tenders':
        return <GovernmentTenders />;
      case 'funding':
        return <GovernmentFunding />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-white text-base">United States Official Gateway Portal</p>
            <p className="text-xs">Providing consolidated directory listings for secure, authorized public services.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">FOIA Disclosures</a>
            <a href="#" className="hover:text-white transition">Accessibility Services</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
