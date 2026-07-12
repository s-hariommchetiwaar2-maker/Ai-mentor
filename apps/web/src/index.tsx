import React, { useState, useMemo, useEffect } from 'react';
import { Button, Card } from '@ai-mentor/shared-ui';

// Import Types
import {
  PageView,
  JobListing,
  TenderListing,
  FundingScheme,
  ContactInquiry
} from './types/index.js';

// Import Mock Data Layer
import {
  STATES_LIST,
  MOCK_JOBS as INITIAL_JOBS,
  MOCK_TENDERS as INITIAL_TENDERS,
  MOCK_FUNDING as INITIAL_FUNDING
} from './data/mockData.js';

// Import Service Layer API connectors
import { jobsService } from './services/jobsService.js';
import { tendersService } from './services/tendersService.js';
import { fundingService } from './services/fundingService.js';
import { contactService } from './services/contactService.js';

// Import Utility Matchers
import {
  filterJobs,
  filterTenders,
  filterFunding,
  determineGlobalSearchTarget
} from './utils/searchUtils.js';

// -----------------------------------------------------------------------------
// Reusable Local Pagination Component
// -----------------------------------------------------------------------------
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-900">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
            <span className="font-bold text-slate-900">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2.5 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <span className="text-sm font-bold">&larr;</span>
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-3.5 py-2 text-xs font-bold focus:z-20 ${
                    isCurrent
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-offset-0'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2.5 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <span className="text-sm font-bold">&rarr;</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// WebApp Main Root Component
// -----------------------------------------------------------------------------
export function WebApp() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scalable list states populated asynchronously via service hook simulations
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [tenders, setTenders] = useState<TenderListing[]>(INITIAL_TENDERS);
  const [fundingSchemes, setFundingSchemes] = useState<FundingScheme[]>(INITIAL_FUNDING);

  // Government Jobs page specific states
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('All');
  const [selectedJobState, setSelectedJobState] = useState<string>('All States');
  const [jobSearch, setJobSearch] = useState<string>('');

  // Government Tenders page specific states
  const [selectedTenderIndustry, setSelectedTenderIndustry] = useState<string>('All');
  const [selectedTenderState, setSelectedTenderState] = useState<string>('All States');
  const [tenderSearch, setTenderSearch] = useState<string>('');

  // Government Funding page specific states
  const [selectedFundingSector, setSelectedFundingSector] = useState<string>('All');
  const [selectedFundingState, setSelectedFundingState] = useState<string>('All States');
  const [fundingSearch, setFundingSearch] = useState<string>('');

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactInquiry>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string>('');
  const [generatedTicketId, setGeneratedTicketId] = useState<string>('');

  // Active inspectors for detail modals (Pure frontend state representation)
  const [activeJobDetail, setActiveJobDetail] = useState<JobListing | null>(null);
  const [activeTenderDetail, setActiveTenderDetail] = useState<TenderListing | null>(null);
  const [activeFundingDetail, setActiveFundingDetail] = useState<FundingScheme | null>(null);

  // Global search text
  const [globalHomeSearch, setGlobalHomeSearch] = useState('');

  // Local pagination states (6 items per page standard)
  const [jobsPage, setJobsPage] = useState(1);
  const [tendersPage, setTendersPage] = useState(1);
  const [fundingPage, setFundingPage] = useState(1);

  // Apply/bid/grant states
  const [hasApplied, setHasApplied] = useState<Record<string, boolean>>({});
  const [submittedBids, setSubmittedBids] = useState<Record<string, boolean>>({});
  const [appliedGrants, setAppliedGrants] = useState<Record<string, boolean>>({});

  const ITEMS_PER_PAGE = 6;

  // Simulate real-world asynchronous API fetch on mount to verify services data layer
  useEffect(() => {
    let isMounted = true;

    // Fetch mock jobs async
    jobsService.fetchJobs().then((data) => {
      if (isMounted) setJobs(data);
    });

    // Fetch mock tenders async
    tendersService.fetchTenders().then((data) => {
      if (isMounted) setTenders(data);
    });

    // Fetch mock funding async
    fundingService.fetchFunding().then((data) => {
      if (isMounted) setFundingSchemes(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter listings dynamically using modular searchUtils
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, jobSearch, selectedJobCategory, selectedJobState);
  }, [jobs, jobSearch, selectedJobCategory, selectedJobState]);

  const filteredTenders = useMemo(() => {
    return filterTenders(tenders, tenderSearch, selectedTenderIndustry, selectedTenderState);
  }, [tenders, tenderSearch, selectedTenderIndustry, selectedTenderState]);

  const filteredFunding = useMemo(() => {
    return filterFunding(fundingSchemes, fundingSearch, selectedFundingSector, selectedFundingState);
  }, [fundingSchemes, fundingSearch, selectedFundingSector, selectedFundingState]);

  // Paginated items
  const paginatedJobs = useMemo(() => {
    const startIndex = (jobsPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, jobsPage]);

  const paginatedTenders = useMemo(() => {
    const startIndex = (tendersPage - 1) * ITEMS_PER_PAGE;
    return filteredTenders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTenders, tendersPage]);

  const paginatedFunding = useMemo(() => {
    const startIndex = (fundingPage - 1) * ITEMS_PER_PAGE;
    return filteredFunding.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFunding, fundingPage]);

  // Derived filter unique categories
  const jobCategories = ['All', 'Central', 'State', 'Railway', 'Banking', 'Defence', 'Police', 'Teaching', 'PSU', 'Judiciary', 'Healthcare', 'Engineering', 'Apprenticeship'];
  const tenderIndustries = ['All', 'Construction', 'IT', 'Energy', 'Healthcare', 'Education', 'Railways', 'Defence', 'Telecom', 'Smart Cities', 'Agriculture'];
  const fundingSectors = ['All', 'Startup', 'MSME', 'Agriculture', 'Women', 'Students', 'Research', 'Export', 'Manufacturing', 'Innovation'];

  // Global search input handling using modular determineGlobalSearchTarget utility
  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalHomeSearch.trim()) return;

    const targetView = determineGlobalSearchTarget(globalHomeSearch, jobs, tenders, fundingSchemes);

    if (targetView === 'jobs') {
      setJobSearch(globalHomeSearch);
      setJobsPage(1);
      setCurrentView('jobs');
    } else if (targetView === 'tenders') {
      setTenderSearch(globalHomeSearch);
      setTendersPage(1);
      setCurrentView('tenders');
    } else if (targetView === 'funding') {
      setFundingSearch(globalHomeSearch);
      setFundingPage(1);
      setCurrentView('funding');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('Please fill out all required fields.');
      setContactSuccess(false);
      return;
    }
    setContactError('');

    // Connect to contact simulated service
    try {
      const response = await contactService.submitInquiry(contactForm);
      if (response.success) {
        setGeneratedTicketId(response.referenceId);
        setContactSuccess(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      setContactError('An unexpected error occurred transmitting the inquiry. Please try again.');
    }
  };

  const handleApplyAction = async (listingId: string) => {
    try {
      const res = await jobsService.applyForJob(listingId);
      if (res.success) {
        setHasApplied((prev) => ({ ...prev, [listingId]: true }));
      }
    } catch {
      // Gracefully handle promise rejection in testing
    }
  };

  const handleTenderBidSubmit = async (tenderId: string) => {
    try {
      const res = await tendersService.placeBid(tenderId);
      if (res.success) {
        setSubmittedBids((prev) => ({ ...prev, [tenderId]: true }));
      }
    } catch {
      // Gracefully handle promise rejection in testing
    }
  };

  const handleGrantApplySubmit = async (fundId: string) => {
    try {
      const res = await fundingService.applyScheme(fundId);
      if (res.success) {
        setAppliedGrants((prev) => ({ ...prev, [fundId]: true }));
      }
    } catch {
      // Gracefully handle promise rejection in testing
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-fadeIn">
      {/* Header Layout */}
      <header className="bg-slate-950 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => { setCurrentView('home'); setGlobalHomeSearch(''); setIsMobileMenuOpen(false); }}
              >
                <div className="bg-blue-600 text-white font-black text-xl rounded-lg w-10 h-10 flex items-center justify-center shadow-md">
                  G
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
                  GovPortal
                </span>
              </div>
              <span className="hidden lg:inline bg-blue-500/10 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-500/20">
                Civic System
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-3">
              <button
                onClick={() => { setCurrentView('home'); setGlobalHomeSearch(''); }}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'home'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('jobs')}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'jobs'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Government Jobs
              </button>
              <button
                onClick={() => setCurrentView('tenders')}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'tenders'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Government Tenders
              </button>
              <button
                onClick={() => setCurrentView('funding')}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'funding'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Government Funding
              </button>
              <button
                onClick={() => setCurrentView('contact')}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'contact'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <span className="text-2xl font-mono">{isMobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2 animate-fadeIn">
            <button
              onClick={() => { setCurrentView('home'); setGlobalHomeSearch(''); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'home' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentView('jobs'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'jobs' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Government Jobs
            </button>
            <button
              onClick={() => { setCurrentView('tenders'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'tenders' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Government Tenders
            </button>
            <button
              onClick={() => { setCurrentView('funding'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'funding' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Government Funding
            </button>
            <button
              onClick={() => { setCurrentView('contact'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'contact' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Contact
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* VIEW: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-12">
            {/* Hero & Search Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

              <div className="relative max-w-3xl space-y-6">
                <span className="bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-500/30">
                  National Civic Gateway
                </span>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                  Discover career opportunities, public bids, and developmental funding.
                </h1>
                <p className="text-slate-300 text-base sm:text-lg max-w-2xl">
                  GovPortal streamlines citizen access to modern utility databases. Query thousands of listings with a single search.
                </p>

                {/* Main Search Bar component */}
                <form onSubmit={handleHomeSearchSubmit} className="pt-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <span className="absolute left-4 top-3.5 text-slate-400 text-lg">🔍</span>
                    <input
                      type="text"
                      placeholder="Search jobs, bids, or grant systems (e.g. 'Solutions', 'Solar', 'Startup', 'MSME')..."
                      value={globalHomeSearch}
                      onChange={(e) => setGlobalHomeSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-slate-900 transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                  <Button type="submit" className="py-3.5 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30">
                    Find Listings
                  </Button>
                </form>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400 items-center">
                  <span>Popular:</span>
                  <button type="button" onClick={() => { setGlobalHomeSearch('Solutions'); }} className="hover:text-blue-300 underline">Solutions Architect</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setGlobalHomeSearch('Solar'); }} className="hover:text-blue-300 underline">Solar Pumps</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setGlobalHomeSearch('Deep-Tech'); }} className="hover:text-blue-300 underline">Deep-Tech Grant</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setGlobalHomeSearch('MSME'); }} className="hover:text-blue-300 underline">MSME Credit</button>
                </div>
              </div>
            </div>

            {/* Services Highlight Grid */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Explore Public Registers</h2>
                  <p className="text-slate-500 text-sm">Select a category below to navigate to our live digital services.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Government Jobs Card */}
                <Card className="hover:shadow-md transition-all duration-300 flex flex-col justify-between border-slate-200/80 group">
                  <div className="space-y-4">
                    <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">
                      💼
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Government Jobs</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        Explore verified career listings, railway engineers, state financial auditors, and signal apprentices.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">{jobs.length} Live Openings</span>
                    <button
                      onClick={() => { setCurrentView('jobs'); setJobSearch(''); setSelectedJobCategory('All'); setSelectedJobState('All States'); setJobsPage(1); }}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Browse Jobs</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </Card>

                {/* Government Tenders Card */}
                <Card className="hover:shadow-md transition-all duration-300 flex flex-col justify-between border-slate-200/80 group">
                  <div className="space-y-4">
                    <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">
                      📄
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Government Tenders</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        Participate in public sector bids, smart city optic fiber installations, eco hybrid microgrids, and WAN backbones.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">{tenders.length} Opportunities</span>
                    <button
                      onClick={() => { setCurrentView('tenders'); setTenderSearch(''); setSelectedTenderIndustry('All'); setSelectedTenderState('All States'); setTendersPage(1); }}
                      className="text-sm font-bold text-amber-600 hover:text-amber-800 flex items-center space-x-1"
                    >
                      <span>Browse Tenders</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </Card>

                {/* Government Funding Card */}
                <Card className="hover:shadow-md transition-all duration-300 flex flex-col justify-between border-slate-200/80 group">
                  <div className="space-y-4">
                    <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">
                      🌱
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Government Funding</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        Discover Mahila women incubators, organic agricultural farming subsidies, MSME loan guarantees, and PLI schemes.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">{fundingSchemes.length} Active Schemes</span>
                    <button
                      onClick={() => { setCurrentView('funding'); setFundingSearch(''); setSelectedFundingSector('All'); setSelectedFundingState('All States'); setFundingPage(1); }}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
                    >
                      <span>Browse Funding</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Informational Guidelines Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <span className="text-3xl">💡</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">How to Apply</h4>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                    Our platform simplifies the process. Explore open records in any catalog, read eligibility checklists, and submit inquiries. You can contact support directly using our secure mail service.
                  </p>
                </div>
              </div>
              <Button onClick={() => setCurrentView('contact')} variant="secondary" className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                Ask a Question
              </Button>
            </div>
          </div>
        )}

        {/* VIEW: GOVERNMENT JOBS */}
        {currentView === 'jobs' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Government Career Register</h1>
              <p className="text-slate-500 text-sm mt-1">
                Explore real-time vacancies, staff roles, and apprenticeships across 12 major sectors.
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Keyword input */}
              <div className="relative md:col-span-2">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter jobs by title, department, keyword..."
                  value={jobSearch}
                  onChange={(e) => { setJobSearch(e.target.value); setJobsPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {jobSearch && (
                  <button onClick={() => { setJobSearch(''); setJobsPage(1); }} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs">
                    Clear
                  </button>
                )}
              </div>

              {/* Sector classification filter */}
              <div>
                <select
                  value={selectedJobCategory}
                  onChange={(e) => { setSelectedJobCategory(e.target.value); setJobsPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Sectors</option>
                  {jobCategories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} Sector
                    </option>
                  ))}
                </select>
              </div>

              {/* State-based filter */}
              <div>
                <select
                  value={selectedJobState}
                  onChange={(e) => { setSelectedJobState(e.target.value); setJobsPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200/80">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              {job.category} Sector
                            </span>
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                              {job.type}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Deadline: {job.deadline}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                          <p className="text-sm font-semibold text-slate-600 mt-0.5">{job.agency}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">{job.department}</p>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Salary Indication</span>
                          <span className="text-sm font-bold text-slate-950">{job.salaryRange}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setActiveJobDetail(job)}
                            variant="secondary"
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                          >
                            Requirements
                          </Button>
                          <Button
                            onClick={() => handleApplyAction(job.id)}
                            variant="primary"
                            className={`px-4 py-1.5 text-xs font-bold rounded ${
                              hasApplied[job.id]
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10'
                            }`}
                          >
                            {hasApplied[job.id] ? '✓ Applied' : 'Apply Now'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Pagination
                  currentPage={jobsPage}
                  totalItems={filteredJobs.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setJobsPage(page)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 text-center py-12 px-4 shadow-sm">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="font-bold text-slate-950 text-base">No matching vacancies found</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms, sector filters, or state settings to see more available career listings.
                </p>
                <Button
                  onClick={() => { setJobSearch(''); setSelectedJobCategory('All'); setSelectedJobState('All States'); setJobsPage(1); }}
                  variant="secondary"
                  className="mt-4 text-xs font-bold"
                >
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Requirements Inspect Modal */}
            {activeJobDetail && (
              <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                        {activeJobDetail.category} Sector Vacancy
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">{activeJobDetail.title}</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">{activeJobDetail.agency}</p>
                    </div>
                    <button
                      onClick={() => setActiveJobDetail(null)}
                      className="text-slate-400 hover:text-slate-600 font-mono text-xl p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600 max-h-[300px] overflow-y-auto pr-1">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">Job Description:</h4>
                      <p className="leading-relaxed text-xs">{activeJobDetail.description}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900">Applicant Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {activeJobDetail.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Salary Indicator</span>
                        <span className="font-bold text-slate-800">{activeJobDetail.salaryRange}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">State & location</span>
                        <span className="font-bold text-slate-800">{activeJobDetail.location} ({activeJobDetail.state})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                      onClick={() => setActiveJobDetail(null)}
                      variant="secondary"
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                    >
                      Close Details
                    </Button>
                    <Button
                      onClick={() => { handleApplyAction(activeJobDetail.id); setActiveJobDetail(null); }}
                      variant="primary"
                      className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      {hasApplied[activeJobDetail.id] ? '✓ Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: GOVERNMENT TENDERS */}
        {currentView === 'tenders' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Government Procurement & Tenders</h1>
              <p className="text-slate-500 text-sm mt-1">
                Participate in institutional bidding across 10 major public industrial sectors.
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter tenders by title, authority, reference ID..."
                  value={tenderSearch}
                  onChange={(e) => { setTenderSearch(e.target.value); setTendersPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {tenderSearch && (
                  <button onClick={() => { setTenderSearch(''); setTendersPage(1); }} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs">
                    Clear
                  </button>
                )}
              </div>

              {/* Industry classification filter */}
              <div>
                <select
                  value={selectedTenderIndustry}
                  onChange={(e) => { setSelectedTenderIndustry(e.target.value); setTendersPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Industries</option>
                  {tenderIndustries.slice(1).map((ind) => (
                    <option key={ind} value={ind}>
                      {ind} Industry
                    </option>
                  ))}
                </select>
              </div>

              {/* State-based filter */}
              <div>
                <select
                  value={selectedTenderState}
                  onChange={(e) => { setSelectedTenderState(e.target.value); setTendersPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tenders Grid */}
            {paginatedTenders.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedTenders.map((tender) => {
                    const isSubmitted = submittedBids[tender.id];
                    const isOpen = tender.status === 'Open';

                    return (
                      <Card key={tender.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200/80">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-2">
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              {tender.industry} Bid
                            </span>
                            <span className="text-xs text-slate-400 font-mono font-medium">{tender.referenceNumber}</span>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{tender.title}</h3>
                            <p className="text-sm font-semibold text-slate-600 mt-0.5">{tender.authority}</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center">
                              <span className="mr-1">📍</span> {tender.location}
                            </p>
                          </div>

                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{tender.description}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Estimated Budget</span>
                            <span className="text-base font-extrabold text-slate-900">{tender.value}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setActiveTenderDetail(tender)}
                              variant="secondary"
                              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                            >
                              Details
                            </Button>
                            <Button
                              onClick={() => isOpen && handleTenderBidSubmit(tender.id)}
                              variant="primary"
                              disabled={!isOpen || isSubmitted}
                              className={`px-4 py-1.5 text-xs font-bold rounded ${
                                isSubmitted
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                                  : isOpen
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {isSubmitted ? '✓ Bid Submitted' : isOpen ? 'Place Bid' : 'Closed'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={tendersPage}
                  totalItems={filteredTenders.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setTendersPage(page)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 text-center py-12 px-4 shadow-sm">
                <span className="text-4xl block mb-2">📄</span>
                <h3 className="font-bold text-slate-950 text-base">No active procurement tenders</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  No tenders match your current lookup criteria. Try checking industrial classifications or select different states.
                </p>
                <Button
                  onClick={() => { setTenderSearch(''); setSelectedTenderIndustry('All'); setSelectedTenderState('All States'); setTendersPage(1); }}
                  variant="secondary"
                  className="mt-4 text-xs font-bold"
                >
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Tender Detail Inspect Modal */}
            {activeTenderDetail && (
              <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-1 rounded">
                        Ref Reference: {activeTenderDetail.referenceNumber}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">{activeTenderDetail.title}</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">{activeTenderDetail.authority}</p>
                    </div>
                    <button
                      onClick={() => setActiveTenderDetail(null)}
                      className="text-slate-400 hover:text-slate-600 font-mono text-xl p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">Procurement Objective:</h4>
                      <p className="leading-relaxed text-xs">{activeTenderDetail.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Estimated Value</span>
                        <span className="font-extrabold text-slate-800 text-sm">{activeTenderDetail.value}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Submission Deadline</span>
                        <span className="font-bold text-slate-800">{activeTenderDetail.deadline}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Published Date</span>
                        <span className="font-medium text-slate-800">{activeTenderDetail.publishedDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Site Location</span>
                        <span className="font-bold text-slate-800">{activeTenderDetail.location} ({activeTenderDetail.state})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                      onClick={() => setActiveTenderDetail(null)}
                      variant="secondary"
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                    >
                      Close Details
                    </Button>
                    <Button
                      disabled={activeTenderDetail.status !== 'Open' || submittedBids[activeTenderDetail.id]}
                      onClick={() => { handleTenderBidSubmit(activeTenderDetail.id); setActiveTenderDetail(null); }}
                      variant="primary"
                      className={`px-5 py-2 text-xs font-bold rounded ${
                        submittedBids[activeTenderDetail.id]
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                          : activeTenderDetail.status === 'Open'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {submittedBids[activeTenderDetail.id] ? '✓ Bid Submitted' : activeTenderDetail.status === 'Open' ? 'Place Bid' : 'Closed'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: GOVERNMENT FUNDING */}
        {currentView === 'funding' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Government Schemes & Incubators</h1>
              <p className="text-slate-500 text-sm mt-1">
                Apply for eco-agricultural subsidies, MSME loan guarantees, and manufacturing PLIs across 9 sectors.
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter grants by scheme name, ministry, description keyword..."
                  value={fundingSearch}
                  onChange={(e) => { setFundingSearch(e.target.value); setFundingPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fundingSearch && (
                  <button onClick={() => { setFundingSearch(''); setFundingPage(1); }} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs">
                    Clear
                  </button>
                )}
              </div>

              {/* Class Sector classification filter */}
              <div>
                <select
                  value={selectedFundingSector}
                  onChange={(e) => { setSelectedFundingSector(e.target.value); setFundingPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Sectors</option>
                  {fundingSectors.slice(1).map((sector) => (
                    <option key={sector} value={sector}>
                      {sector} Schemes
                    </option>
                  ))}
                </select>
              </div>

              {/* State filter */}
              <div>
                <select
                  value={selectedFundingState}
                  onChange={(e) => { setSelectedFundingState(e.target.value); setFundingPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Funding Grid */}
            {paginatedFunding.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paginatedFunding.map((fund) => {
                    const isApplied = appliedGrants[fund.id];

                    return (
                      <Card key={fund.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200/80">
                        <div className="space-y-4">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                            {fund.sector} Support
                          </span>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 line-clamp-2">{fund.title}</h3>
                            <p className="text-xs font-semibold text-slate-600 mt-1">{fund.ministry}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{fund.department}</p>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{fund.description}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col space-y-3">
                          <div className="bg-slate-50 p-2.5 rounded text-xs">
                            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px]">Eligible Target</span>
                            <span className="font-semibold text-slate-700 line-clamp-1">{fund.eligibility}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-emerald-600">{fund.amount}</span>
                            <div className="flex space-x-1.5">
                              <Button
                                onClick={() => setActiveFundingDetail(fund)}
                                variant="secondary"
                                className="px-2.5 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                              >
                                Benefits
                              </Button>
                              <Button
                                onClick={() => handleGrantApplySubmit(fund.id)}
                                variant="primary"
                                className={`px-3 py-1.5 text-[10px] font-bold rounded ${
                                  isApplied
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {isApplied ? '✓ Enrolled' : 'Apply Scheme'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={fundingPage}
                  totalItems={filteredFunding.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setFundingPage(page)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 text-center py-12 px-4 shadow-sm">
                <span className="text-4xl block mb-2">🌱</span>
                <h3 className="font-bold text-slate-950 text-base">No active financial programs</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  We currently do not have funding initiatives matching that keyword. Try resetting filters to view all classes.
                </p>
                <Button
                  onClick={() => { setFundingSearch(''); setSelectedFundingSector('All'); setSelectedFundingState('All States'); setFundingPage(1); }}
                  variant="secondary"
                  className="mt-4 text-xs font-bold"
                >
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Funding Scheme Benefits Modal */}
            {activeFundingDetail && (
              <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                        {activeFundingDetail.sector} Class Scheme
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">{activeFundingDetail.title}</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">{activeFundingDetail.ministry}</p>
                    </div>
                    <button
                      onClick={() => setActiveFundingDetail(null)}
                      className="text-slate-400 hover:text-slate-600 font-mono text-xl p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">Program Objective:</h4>
                      <p className="leading-relaxed text-xs">{activeFundingDetail.description}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-xs">Direct Advantages & Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {activeFundingDetail.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                      <span className="text-slate-400 font-medium">Scheme Capital Limit</span>
                      <p className="font-black text-emerald-600 text-sm">{activeFundingDetail.amount}</p>
                      <span className="text-slate-400 font-medium block pt-1">Eligibility Criteria</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{activeFundingDetail.eligibility}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                      onClick={() => setActiveFundingDetail(null)}
                      variant="secondary"
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                    >
                      Close Details
                    </Button>
                    <Button
                      onClick={() => { handleGrantApplySubmit(activeFundingDetail.id); setActiveFundingDetail(null); }}
                      variant="primary"
                      className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      {appliedGrants[activeFundingDetail.id] ? '✓ Enrolled' : 'Apply Scheme'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: CONTACT PAGE */}
        {currentView === 'contact' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 text-center">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Citizen Contact Center</h1>
              <p className="text-slate-500 text-sm mt-1">
                Reach out to technical support representatives, filing coordinators, or submit grievance appeals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Information Panel */}
              <div className="space-y-6 md:col-span-1">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

                  <h3 className="font-bold text-lg border-b border-white/10 pb-2">Support Channels</h3>

                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="space-y-1">
                      <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Headquarters Address</span>
                      <p className="font-bold text-white text-xs">National Civic Informatics Block, C-Wing, New Delhi - 110001</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Grievance Hotline</span>
                      <p className="font-bold text-white text-xs">+1 (800) 555-0199 (Mon-Fri, 9am - 5pm IST)</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Inquiry Email Desk</span>
                      <p className="font-bold text-white text-xs">citizen.desk@govportal.org</p>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-[10px] leading-relaxed text-blue-300">
                    <strong>Note:</strong> Typical turn-around cycles for compliance checks can vary between 2-5 working days.
                  </div>
                </div>

                {/* Office locations card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">State Helpdesks</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Local sub-centers exist in Mumbai, Bengaluru, and Guwahati to facilitate offline verification processing.
                  </p>
                </div>
              </div>

              {/* Form Panel */}
              <div className="md:col-span-2">
                <Card className="p-6 border-slate-200/80 shadow-sm space-y-6">
                  <h3 className="font-bold text-lg text-slate-900">Send an Electronic Inquiry</h3>

                  {contactSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 animate-scaleUp">
                      <span className="text-4xl block">✉️</span>
                      <h4 className="font-extrabold text-emerald-800 text-sm">Message Transmitted Successfully!</h4>
                      <p className="text-xs text-emerald-600 max-w-sm mx-auto leading-relaxed">
                        Thank you for contacting the citizen helpdesk. Ticket Reference ID: <strong className="font-mono text-slate-900">{generatedTicketId}</strong> has been logged. We will reach out to you shortly.
                      </p>
                      <Button
                        onClick={() => setContactSuccess(false)}
                        variant="secondary"
                        className="text-[10px] font-bold mt-2"
                      >
                        Submit Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      {contactError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-600 font-medium">
                          ⚠️ {contactError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Subject / Classification *</label>
                        <input
                          type="text"
                          required
                          placeholder="Filing issues, verification, etc."
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Inquiry Narrative / Message *</label>
                        <textarea
                          rows={5}
                          required
                          placeholder="Provide deep context about your filing number, bid queries, or issues..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                        ></textarea>
                      </div>

                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">* Required field information</span>
                        <Button
                          type="submit"
                          className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow animate-pulse hover:animate-none"
                        >
                          Send Inquiry
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Layout */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white font-black text-sm rounded w-6 h-6 flex items-center justify-center">
                  G
                </div>
                <h3 className="text-white text-lg font-black">GovPortal</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Your simplified entry point to discovering state career directories, municipal procurement bids, and civic incubation programs. Built to modernize access to governmental listings.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Quick Actions</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => { setCurrentView('jobs'); setJobSearch(''); setSelectedJobCategory('All'); setSelectedJobState('All States'); setJobsPage(1); }} className="hover:text-white transition-colors">Search Jobs</button></li>
                <li><button onClick={() => { setCurrentView('tenders'); setTenderSearch(''); setSelectedTenderIndustry('All'); setSelectedTenderState('All States'); setTendersPage(1); }} className="hover:text-white transition-colors">Review Bids</button></li>
                <li><button onClick={() => { setCurrentView('funding'); setFundingSearch(''); setSelectedFundingSector('All'); setSelectedFundingState('All States'); setFundingPage(1); }} className="hover:text-white transition-colors">Apply for Funding</button></li>
                <li><button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">Contact Center</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Government Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Ministry Web Index</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Civic Grievance Desk</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>National Data Registry</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Gazette Publications</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Disclaimer</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                GovPortal is a high-fidelity demonstration sandbox dashboard displaying mock public listings. This app is strictly client-side. No real applications are filed, and no official governmental status is represented.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
            <p>&copy; {new Date().getFullYear()} GovPortal Civic System. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>Terms of Use</a>
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>API Sandbox</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WebApp;
