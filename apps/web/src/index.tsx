import React, { useState, useMemo, useEffect } from 'react';
import { Button, Card } from '@ai-mentor/shared-ui';

// Import Types
import {
  PageView,
  UserPlan,
  JobListing,
  TenderListing,
  FundingScheme,
  ContactInquiry
} from './types/index.js';

// Import Mock Data Layer
import {
  STATES_LIST,
  COUNTRIES_LIST,
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
  sortJobs,
  filterTenders,
  sortTenders,
  filterFunding,
  sortFunding,
  determineGlobalSearchTarget,
  SortOption
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
// Helper to resolve cover/placeholder images for Jobs, Tenders, and Funding
// -----------------------------------------------------------------------------
const getListingImage = (item: { image?: string; category?: string; industry?: string; sector?: string }) => {
  if (item.image) return item.image;

  const tag = (item.category || item.industry || item.sector || '').toLowerCase();

  if (tag.includes('infrastructure') || tag.includes('building') || tag.includes('construction') || tag.includes('central') || tag.includes('state')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('road') || tag.includes('highway')) {
    return 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('airport') || tag.includes('aviation') || tag.includes('defence')) {
    return 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('rail') || tag.includes('metro')) {
    return 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('power') || tag.includes('energy')) {
    return 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('water')) {
    return 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('healthcare') || tag.includes('health') || tag.includes('clinic')) {
    return 'https://images.unsplash.com/photo-1584515901407-d8f468315264?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('education') || tag.includes('teach') || tag.includes('class')) {
    return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('it') || tag.includes('digital') || tag.includes('tech') || tag.includes('software')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('agri') || tag.includes('farm')) {
    return 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('port') || tag.includes('ship')) {
    return 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('mining') || tag.includes('oil')) {
    return 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80';
  }
  if (tag.includes('bank') || tag.includes('finance') || tag.includes('credit') || tag.includes('startup') || tag.includes('msme') || tag.includes('research') || tag.includes('innovation')) {
    return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
};

// -----------------------------------------------------------------------------
// WebApp Main Root Component
// -----------------------------------------------------------------------------
export function WebApp() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Subscription and notification states
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Job: Senior Cloud Solutions Architect',
      department: 'Software Architecture Wing',
      date: '2026-07-01',
      category: 'Job',
    },
    {
      id: 'notif-2',
      title: 'New Tender: Urban Multi-Modal Transit Terminal',
      department: 'Urban Transport Division',
      date: '2026-08-01',
      category: 'Tender',
    },
    {
      id: 'notif-3',
      title: 'New Funding: National Deep-Tech Startups Grant',
      department: 'Startup India & Innovation Desk',
      date: '2026-07-01',
      category: 'Funding',
    },
  ]);

  // Scalable list states populated asynchronously via service hook simulations
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [tenders, setTenders] = useState<TenderListing[]>(INITIAL_TENDERS);
  const [fundingSchemes, setFundingSchemes] = useState<FundingScheme[]>(INITIAL_FUNDING);

  // Advanced Multi-Filters: Government Jobs page
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('All');
  const [selectedJobState, setSelectedJobState] = useState<string>('All States');
  const [selectedJobCountry, setSelectedJobCountry] = useState<string>('All Countries');
  const [selectedJobStatus, setSelectedJobStatus] = useState<string>('All');
  const [jobSearch, setJobSearch] = useState<string>('');
  const [jobSort, setJobSort] = useState<SortOption>('none');

  // Advanced Multi-Filters: Government Tenders page
  const [selectedTenderIndustry, setSelectedTenderIndustry] = useState<string>('All');
  const [selectedTenderState, setSelectedTenderState] = useState<string>('All States');
  const [selectedTenderCountry, setSelectedTenderCountry] = useState<string>('All Countries');
  const [selectedTenderStatus, setSelectedTenderStatus] = useState<string>('All');
  const [tenderSearch, setTenderSearch] = useState<string>('');
  const [tenderSort, setTenderSort] = useState<SortOption>('none');

  // Advanced Multi-Filters: Government Funding page
  const [selectedFundingSector, setSelectedFundingSector] = useState<string>('All');
  const [selectedFundingState, setSelectedFundingState] = useState<string>('All States');
  const [selectedFundingCountry, setSelectedFundingCountry] = useState<string>('All Countries');
  const [selectedFundingStatus, setSelectedFundingStatus] = useState<string>('All');
  const [fundingSearch, setFundingSearch] = useState<string>('');
  const [fundingSort, setFundingSort] = useState<SortOption>('none');

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

  // Active inspectors for detail pages (Phase Opportunity Details implementation)
  const [activeJobDetail, setActiveJobDetail] = useState<JobListing | null>(null);
  const [activeTenderDetail, setActiveTenderDetail] = useState<TenderListing | null>(null);
  const [activeFundingDetail, setActiveFundingDetail] = useState<FundingScheme | null>(null);

  // Bookmarking and sharing state triggers (Phase 4 requirement)
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [sharedAlert, setSharedAlert] = useState<string | null>(null);

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

  // Filter and sort listings dynamically using modular searchUtils
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = filterJobs(jobs, jobSearch, selectedJobCategory, selectedJobState, selectedJobCountry, selectedJobStatus);
    return sortJobs(filtered, jobSort);
  }, [jobs, jobSearch, selectedJobCategory, selectedJobState, selectedJobCountry, selectedJobStatus, jobSort]);

  const filteredAndSortedTenders = useMemo(() => {
    const filtered = filterTenders(tenders, tenderSearch, selectedTenderIndustry, selectedTenderState, selectedTenderCountry, selectedTenderStatus);
    return sortTenders(filtered, tenderSort);
  }, [tenders, tenderSearch, selectedTenderIndustry, selectedTenderState, selectedTenderCountry, selectedTenderStatus, tenderSort]);

  const filteredAndSortedFunding = useMemo(() => {
    const filtered = filterFunding(fundingSchemes, fundingSearch, selectedFundingSector, selectedFundingState, selectedFundingCountry, selectedFundingStatus);
    return sortFunding(filtered, fundingSort);
  }, [fundingSchemes, fundingSearch, selectedFundingSector, selectedFundingState, selectedFundingCountry, selectedFundingStatus, fundingSort]);

  // Paginated items
  const paginatedJobs = useMemo(() => {
    const startIndex = (jobsPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedJobs, jobsPage]);

  const paginatedTenders = useMemo(() => {
    const startIndex = (tendersPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTenders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTenders, tendersPage]);

  const paginatedFunding = useMemo(() => {
    const startIndex = (fundingPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedFunding.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedFunding, fundingPage]);

  // Related opportunities finders (based on matches in state, ministry, or industry category)
  const relatedJobs = useMemo(() => {
    if (!activeJobDetail) return [];
    return jobs.filter(
      (j) => j.id !== activeJobDetail.id && (j.category === activeJobDetail.category || j.state === activeJobDetail.state)
    ).slice(0, 3);
  }, [activeJobDetail, jobs]);

  const relatedTenders = useMemo(() => {
    if (!activeTenderDetail) return [];
    return tenders.filter(
      (t) => t.id !== activeTenderDetail.id && (t.industry === activeTenderDetail.industry || t.state === activeTenderDetail.state)
    ).slice(0, 3);
  }, [activeTenderDetail, tenders]);

  const relatedFunding = useMemo(() => {
    if (!activeFundingDetail) return [];
    return fundingSchemes.filter(
      (f) => f.id !== activeFundingDetail.id && (f.sector === activeFundingDetail.sector || f.state === activeFundingDetail.state)
    ).slice(0, 3);
  }, [activeFundingDetail, fundingSchemes]);

  // Derived filter unique categories
  const jobCategories = ['All', 'Central', 'State', 'Railway', 'Banking', 'Defence', 'Police', 'Teaching', 'PSU', 'Judiciary', 'Healthcare', 'Engineering', 'Apprenticeship'];
  const tenderIndustries = [
    'All',
    'Infrastructure',
    'Roads & Highways',
    'Airports & Aviation',
    'Railways & Metro',
    'Power & Energy',
    'Water Resources',
    'Healthcare',
    'Education',
    'IT & Digital',
    'Government Buildings',
    'Defence',
    'Agriculture',
    'Urban Development',
    'Ports & Shipping',
    'Mining & Oil',
    'International Tenders'
  ] as const;
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
      // Gracefully handle promise rejection
    }
  };

  const handleTenderBidSubmit = async (tenderId: string) => {
    try {
      const res = await tendersService.placeBid(tenderId);
      if (res.success) {
        setSubmittedBids((prev) => ({ ...prev, [tenderId]: true }));
      }
    } catch {
      // Gracefully handle promise rejection
    }
  };

  const handleGrantApplySubmit = async (fundId: string) => {
    try {
      const res = await fundingService.applyScheme(fundId);
      if (res.success) {
        setAppliedGrants((prev) => ({ ...prev, [fundId]: true }));
      }
    } catch {
      // Gracefully handle promise rejection
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShareClick = (title: string) => {
    const textAlert = `Link copied: "${title}" is ready to share!`;
    setSharedAlert(textAlert);
    setTimeout(() => {
      setSharedAlert(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-fadeIn">
      {/* Global Share Toast Notification Alert */}
      {sharedAlert && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 animate-slideIn">
          <span>🔗</span>
          <span>{sharedAlert}</span>
        </div>
      )}

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
                onClick={() => { setCurrentView('jobs'); setActiveJobDetail(null); }}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'jobs'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Government Jobs
              </button>
              <button
                onClick={() => { setCurrentView('tenders'); setActiveTenderDetail(null); }}
                className={`text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'tenders'
                    ? 'text-white bg-slate-800 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Government Tenders
              </button>
              <button
                onClick={() => { setCurrentView('funding'); setActiveFundingDetail(null); }}
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

            {/* Desktop Actions (Plan Switcher + Notification Bell) */}
            <div className="hidden md:flex items-center space-x-4 relative">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-all relative focus:outline-none"
                  title="Opportunity Alerts"
                >
                  <span className="text-xl">🔔</span>
                  <span className="absolute top-1 right-1 bg-red-600 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                </button>

                {/* Notifications Dropdown menu */}
                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-3 w-80 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                    <div className="bg-slate-950 text-white p-3.5 border-b border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-black tracking-wider uppercase">🔔 Real-Time Alerts</span>
                      <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-extrabold uppercase">Free Plan</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
                          onClick={() => {
                            setShowNotificationsDropdown(false);
                            if (notif.category === 'Job') {
                              setCurrentView('jobs');
                              setActiveJobDetail(null);
                            } else if (notif.category === 'Tender') {
                              setCurrentView('tenders');
                              setActiveTenderDetail(null);
                            } else if (notif.category === 'Funding') {
                              setCurrentView('funding');
                              setActiveFundingDetail(null);
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                              notif.category === 'Job'
                                ? 'bg-blue-100 text-blue-800'
                                : notif.category === 'Tender'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {notif.category}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">{notif.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{notif.title}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{notif.department}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-2.5 text-center text-[10px] text-slate-400 font-semibold border-t border-slate-100">
                      Showing alerts for new Opportunities
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Toggle Button */}
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] uppercase font-black text-slate-400">Plan:</span>
                {userPlan === 'free' ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200">🎫 Free (1M)</span>
                    <button
                      onClick={() => setUserPlan('premium')}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded transition-colors"
                    >
                      Upgrade
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">👑 Premium</span>
                    <button
                      onClick={() => setUserPlan('free')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold px-2 py-1 rounded transition-colors"
                    >
                      Downgrade
                    </button>
                  </div>
                )}
              </div>
            </div>

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
              onClick={() => { setCurrentView('jobs'); setActiveJobDetail(null); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'jobs' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Government Jobs
            </button>
            <button
              onClick={() => { setCurrentView('tenders'); setActiveTenderDetail(null); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors ${
                currentView === 'tenders' ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Government Tenders
            </button>
            <button
              onClick={() => { setCurrentView('funding'); setActiveFundingDetail(null); setIsMobileMenuOpen(false); }}
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

            {/* Mobile Plan & Notification Actions */}
            <div className="border-t border-slate-800 pt-3 mt-3 space-y-3">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400">Active Subscription:</span>
                {userPlan === 'free' ? (
                  <button
                    onClick={() => { setUserPlan('premium'); setIsMobileMenuOpen(false); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    🎫 Upgrade Free (1M)
                  </button>
                ) : (
                  <button
                    onClick={() => { setUserPlan('free'); setIsMobileMenuOpen(false); }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    👑 Downgrade Premium
                  </button>
                )}
              </div>

              {/* Mobile Notification Alert items */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Recent Alerts</span>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (notif.category === 'Job') {
                        setCurrentView('jobs');
                        setActiveJobDetail(null);
                      } else if (notif.category === 'Tender') {
                        setCurrentView('tenders');
                        setActiveTenderDetail(null);
                      } else if (notif.category === 'Funding') {
                        setCurrentView('funding');
                        setActiveFundingDetail(null);
                      }
                    }}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="text-[9px] font-black text-blue-400 block uppercase">{notif.category}</span>
                      <span className="font-bold text-slate-200 line-clamp-1">{notif.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 whitespace-nowrap ml-2">{notif.date}</span>
                  </div>
                ))}
              </div>
            </div>
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
                      placeholder="Search jobs, bids, or grant systems (e.g. 'Solutions', 'Solar', 'Startup', 'MSME')...."
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
        {currentView === 'jobs' && !activeJobDetail && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Government Career Register</h1>
              <p className="text-slate-500 text-sm mt-1">
                Explore real-time vacancies, staff roles, and apprenticeships across 12 major sectors.
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-6 gap-3">
              {/* Keyword input */}
              <div className="relative md:col-span-2">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter jobs..."
                  value={jobSearch}
                  onChange={(e) => { setJobSearch(e.target.value); setJobsPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sector classification filter */}
              <div>
                <select
                  value={selectedJobCategory}
                  onChange={(e) => { setSelectedJobCategory(e.target.value); setJobsPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
                >
                  <option value="All">All Sectors</option>
                  {jobCategories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* State-based filter */}
              <div>
                <select
                  value={selectedJobState}
                  onChange={(e) => { setSelectedJobState(e.target.value); setJobsPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Country filter */}
              <div>
                <select
                  value={selectedJobCountry}
                  onChange={(e) => { setSelectedJobCountry(e.target.value); setJobsPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order filter */}
              <div>
                <select
                  value={jobSort}
                  onChange={(e) => { setJobSort(e.target.value as SortOption); setJobsPage(1); }}
                  className="w-full border border-blue-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-800 font-bold"
                >
                  <option value="none">Sort By Default</option>
                  <option value="deadline-asc">Deadline (Ascending)</option>
                  <option value="deadline-desc">Deadline (Descending)</option>
                  <option value="budget-desc">Salary (Highest First)</option>
                  <option value="budget-asc">Salary (Lowest First)</option>
                  <option value="title-asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200/80 relative overflow-hidden bg-white p-0">
                      {userPlan === 'free' && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-bl-lg tracking-wider flex items-center space-x-1 shadow-sm z-10">
                          <span>🔒</span>
                          <span>Locked</span>
                        </div>
                      )}
                      <div className="h-40 w-full overflow-hidden relative">
                        <img src={getListingImage(job)} alt={job.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              {job.category} Sector
                            </span>
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                              {job.type}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Date: {job.deadline}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                          <p className="text-sm font-semibold text-slate-600 mt-0.5">{job.agency}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">{job.department} ({job.ministry})</p>
                        </div>
                        {userPlan === 'free' ? (
                          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center space-x-2 text-xs text-slate-500">
                            <span>🔒</span>
                            <span>Detailed description locked on Free Plan.</span>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mx-5 mb-5">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Salary Indication</span>
                          {userPlan === 'free' ? (
                            <span className="text-xs font-bold text-slate-400">🔒 Locked</span>
                          ) : (
                            <span className="text-sm font-bold text-slate-950">{job.salaryRange}</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {userPlan === 'free' ? (
                            <>
                              <button
                                onClick={() => { setUserPlan('premium'); handleShareClick("Premium Unlocked"); }}
                                className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
                              >
                                Unlock with Premium
                              </button>
                              <Button
                                onClick={() => { setActiveJobDetail(job); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                              >
                                View (Locked)
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => { setActiveJobDetail(job); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                            >
                              Explore Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Pagination
                  currentPage={jobsPage}
                  totalItems={filteredAndSortedJobs.length}
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
                  onClick={() => { setJobSearch(''); setSelectedJobCategory('All'); setSelectedJobState('All States'); setSelectedJobCountry('All Countries'); setSelectedJobStatus('All'); setJobSort('none'); setJobsPage(1); }}
                  className="mt-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: GOVERNMENT JOBS DETAIL PAGE */}
        {currentView === 'jobs' && activeJobDetail && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header actions */}
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setActiveJobDetail(null)}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
              >
                &larr; Back to Listings
              </Button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleBookmark(activeJobDetail.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                    bookmarkedItems[activeJobDetail.id]
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {bookmarkedItems[activeJobDetail.id] ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
                <button
                  onClick={() => handleShareClick(activeJobDetail.title)}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Core Details Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="h-64 w-full overflow-hidden rounded-xl relative shadow-inner">
                <img src={getListingImage(activeJobDetail)} alt={activeJobDetail.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-2">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
                    {activeJobDetail.category} Sector Vacancy
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{activeJobDetail.title}</h1>
                  <p className="text-sm font-semibold text-slate-600">{activeJobDetail.agency}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Monthly/Annual Salary</span>
                  <span className="text-xl font-black text-blue-600">{activeJobDetail.salaryRange}</span>
                </div>
              </div>

              {/* Informational parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Ministry</span>
                  <span className="font-bold text-slate-800">{activeJobDetail.ministry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Department</span>
                  <span className="font-bold text-slate-800">{activeJobDetail.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">State & Country</span>
                  <span className="font-bold text-slate-800">{activeJobDetail.location} ({activeJobDetail.state}, {activeJobDetail.country})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Application Deadline</span>
                  <span className="font-black text-red-600">{activeJobDetail.deadline}</span>
                </div>
              </div>

              {userPlan === 'free' ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-fadeIn">
                  <span className="text-5xl block">🔒</span>
                  <h3 className="text-lg font-black text-slate-900">Detailed Information Locked</h3>
                  <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                    Full access to detailed qualifications, required documents checklists, evaluation selection procedures, official portal links, and instant application forms is restricted to Premium subscribers.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => { setUserPlan('premium'); handleShareClick("Premium Unlocked"); }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-md text-xs transition-all"
                    >
                      👑 Unlock with Premium
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Free Plan Validity: 1 Month
                  </div>
                </div>
              ) : (
                <>
                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">Complete Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{activeJobDetail.description}</p>
                  </div>

                  {/* Eligibility */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">Eligibility Checklist</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">{activeJobDetail.eligibility}</p>
                  </div>

                  {/* Requirements list */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">Mandatory Qualifications</h3>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm">
                      {activeJobDetail.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">Required Documents Checklist</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <p className="text-xs text-slate-500 mb-1">Please ensure you have scanned copies of the following documents ready before submitting your application:</p>
                      <ul className="space-y-1.5 text-slate-700 text-xs font-medium">
                        {activeJobDetail.requiredDocuments && activeJobDetail.requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Selection Process */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">Selection & Evaluation Process</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{activeJobDetail.selectionProcess}</p>
                  </div>

                  {/* Important Instructions */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">Important Instructions</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
                      <span className="font-bold block">⚠️ Crucial Warning Notes:</span>
                      <p>{activeJobDetail.importantInstructions}</p>
                    </div>
                  </div>

                  {/* Actions & Dates */}
                  <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col text-xs text-slate-400 space-y-0.5">
                      <span>Published Date: <strong>{activeJobDetail.publishedDate}</strong></span>
                      <span>Official Gazette/Source: <strong className="text-slate-600">{activeJobDetail.officialSource}</strong></span>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <a
                        href={activeJobDetail.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg text-center flex-grow sm:flex-grow-0"
                      >
                        Official Website
                      </a>
                      <Button
                        onClick={() => handleApplyAction(activeJobDetail.id)}
                        className={`px-6 py-2.5 text-xs font-bold rounded-lg flex-grow sm:flex-grow-0 ${
                          hasApplied[activeJobDetail.id]
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10'
                        }`}
                      >
                        {hasApplied[activeJobDetail.id] ? '✓ Applied' : 'Apply Opportunity'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Related opportunities */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Related Career Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedJobs.map((rj) => (
                  <Card key={rj.id} className="p-4 border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {rj.category} Sector
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">{rj.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rj.agency}</p>
                    </div>
                    <Button
                      onClick={() => { setActiveJobDetail(rj); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="mt-4 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 w-full py-1.5"
                    >
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: GOVERNMENT TENDERS */}
        {currentView === 'tenders' && !activeTenderDetail && (() => {
          // Reusable Category Metadata
          const TENDER_CATEGORY_ICONS: Record<string, string> = {
            'All': '📋',
            'Infrastructure': '🏗️',
            'Roads & Highways': '🛣️',
            'Airports & Aviation': '✈️',
            'Railways & Metro': '🚇',
            'Power & Energy': '⚡',
            'Water Resources': '💧',
            'Healthcare': '🏥',
            'Education': '🎓',
            'IT & Digital': '💻',
            'Government Buildings': '🏛️',
            'Defence': '🛡️',
            'Agriculture': '🚜',
            'Urban Development': '🌆',
            'Ports & Shipping': '🚢',
            'Mining & Oil': '⛏️',
            'International Tenders': '🌐'
          };

          const TENDER_CATEGORY_DESC: Record<string, string> = {
            'All': 'Explore the master dashboard of global public tenders and procurement projects.',
            'Infrastructure': 'Engineering, public utility installations, and major civil structure bidding operations.',
            'Roads & Highways': 'National highway widening, expressway asphalt paving, and regional bypass construction.',
            'Airports & Aviation': 'Airport baggage conveyor retrofits, runway safety lighting, and radar upgrades.',
            'Railways & Metro': 'Metro rail track laying, deep underground tunnel boring, and station platform building.',
            'Power & Energy': 'Decentralized hybrid solar/wind microgrids, sub-station transformer supplies, and smart grid meters.',
            'Water Resources': 'Water supply filtration beds, canal lining reinforcement, and irrigation distribution networks.',
            'Healthcare': 'Secure state clinical databases, hospital critical care wing construction, and digital records.',
            'Education': 'Interactive multi-touch classroom displays, state school system LMS, and educational software.',
            'IT & Digital': 'Smart transport route optimizers, deep learning fleet dispatch systems, and digital portals.',
            'Government Buildings': 'Green secretariat administrative offices, public housing, and civic space builds.',
            'Defence': 'Coastal patrol surveillance S-band radar stations, secure communication transceivers, and telemetry.',
            'Agriculture': 'High-output DC solar irrigation pump distributions, farming equipment, and modern grain silos.',
            'Urban Development': 'Municipal broadband trenching, optic fiber cables, and smart city CCTV system networks.',
            'Ports & Shipping': 'High-capacity container terminal gantry crane infrastructure and port cargo installations.',
            'Mining & Oil': 'Offshore pipeline anti-corrosive reinforcements, high-pressure natural gas systems, and extractions.',
            'International Tenders': 'Transnational 400kV electricity connections, cross-border grids, and multilateral programs.'
          };

          const getCategoryCount = (categoryName: string) => {
            return tenders.filter(t => t.industry === categoryName).length;
          };

          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Header block with breadcrumbs */}
              <div className="border-b border-slate-200 pb-5">
                <nav className="flex space-x-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span className="cursor-pointer hover:text-blue-600" onClick={() => { setSelectedTenderIndustry('All'); setTendersPage(1); }}>Tender Platform</span>
                  <span>/</span>
                  <span className="text-slate-600">{selectedTenderIndustry === 'All' ? 'Overview' : selectedTenderIndustry}</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
                      <span>{TENDER_CATEGORY_ICONS[selectedTenderIndustry]}</span>
                      <span>{selectedTenderIndustry === 'All' ? 'Procurement Control Center' : `${selectedTenderIndustry} Tenders`}</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-3xl">
                      {TENDER_CATEGORY_DESC[selectedTenderIndustry]}
                    </p>
                  </div>
                  {selectedTenderIndustry !== 'All' && (
                    <Button
                      onClick={() => { setSelectedTenderIndustry('All'); setTendersPage(1); }}
                      variant="secondary"
                      className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 whitespace-nowrap self-start md:self-auto shadow-sm"
                    >
                      &larr; Back to Dashboard
                    </Button>
                  )}
                </div>
              </div>

              {/* Sub-navigation Menu bar: Left Sidebar (Desktop) + Horizontal Pill ribbon (Mobile/Tablet) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Navigation panel */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Desktop Sidebar (16 categories list) */}
                  <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-1">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Tender Industries</h3>
                    {tenderIndustries.map((ind) => {
                      const isActive = selectedTenderIndustry === ind;
                      const bidCount = getCategoryCount(ind);
                      return (
                        <button
                          key={ind}
                          onClick={() => { setSelectedTenderIndustry(ind); setTendersPage(1); }}
                          className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <span className="text-sm">{TENDER_CATEGORY_ICONS[ind]}</span>
                            <span className="truncate">{ind === 'All' ? 'All Overview' : ind}</span>
                          </div>
                          {ind !== 'All' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {bidCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile/Tablet Horizontal Scroll Ribbon list */}
                  <div className="block lg:hidden bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-1">Select Industry</span>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                      {tenderIndustries.map((ind) => {
                        const isActive = selectedTenderIndustry === ind;
                        const bidCount = getCategoryCount(ind);
                        return (
                          <button
                            key={ind}
                            onClick={() => { setSelectedTenderIndustry(ind); setTendersPage(1); }}
                            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{TENDER_CATEGORY_ICONS[ind]}</span>
                            <span>{ind === 'All' ? 'Overview' : ind}</span>
                            {ind !== 'All' && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {bidCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Main Content Pane (Grid & Filters mapped to active category) */}
                <div className="lg:col-span-3 space-y-6">
                  {/* If "All" Overview is active, we display the Dashboard Overview cards plus a sample general list */}
                  {selectedTenderIndustry === 'All' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tenderIndustries.slice(1).map((ind) => {
                          const bidCount = getCategoryCount(ind);
                          return (
                            <Card
                              key={ind}
                              className="p-5 border-slate-200/80 hover:shadow-md transition-all cursor-pointer group flex items-start space-x-4 bg-white"
                              onClick={() => { setSelectedTenderIndustry(ind); setTendersPage(1); }}
                            >
                              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm font-bold group-hover:scale-105 transition-transform shrink-0">
                                {TENDER_CATEGORY_ICONS[ind]}
                              </div>
                              <div className="space-y-1.5 flex-grow min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm truncate">{ind}</h3>
                                  <span className="bg-blue-50 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                                    {bidCount} Live Bids
                                  </span>
                                </div>
                                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                                  {TENDER_CATEGORY_DESC[ind]}
                                </p>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* If specific category or list display of active items is rendering */}
                  <div className="space-y-6">
                    {/* Advanced Filters block mapping category selection */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3">
                      {/* Category-scoped Search input */}
                      <div className="relative md:col-span-2">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                        <input
                          type="text"
                          placeholder={selectedTenderIndustry === 'All' ? "Search across all categories..." : `Search inside ${selectedTenderIndustry}...`}
                          value={tenderSearch}
                          onChange={(e) => { setTenderSearch(e.target.value); setTendersPage(1); }}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* State filter */}
                      <div>
                        <select
                          value={selectedTenderState}
                          onChange={(e) => { setSelectedTenderState(e.target.value); setTendersPage(1); }}
                          className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                        >
                          {STATES_LIST.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Country filter */}
                      <div>
                        <select
                          value={selectedTenderCountry}
                          onChange={(e) => { setSelectedTenderCountry(e.target.value); setTendersPage(1); }}
                          className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                        >
                          {COUNTRIES_LIST.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Sort Order filter */}
                      <div>
                        <select
                          value={tenderSort}
                          onChange={(e) => { setTenderSort(e.target.value as SortOption); setTendersPage(1); }}
                          className="w-full border border-blue-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-800 font-bold"
                        >
                          <option value="none">Sort By Default</option>
                          <option value="deadline-asc">Deadline (Ascending)</option>
                          <option value="deadline-desc">Deadline (Descending)</option>
                          <option value="budget-desc">Budget (Highest First)</option>
                          <option value="budget-asc">Budget (Lowest First)</option>
                          <option value="title-asc">Alphabetical (A-Z)</option>
                        </select>
                      </div>
                    </div>

                    {/* Responsive Tenders Card Grid */}
                    {paginatedTenders.length > 0 ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                          {paginatedTenders.map((tender) => {
                            return (
                              <Card key={tender.id} className="hover:shadow-md transition-all flex flex-col justify-between border-slate-200/80 bg-white p-0 relative overflow-hidden">
                                {userPlan === 'free' && (
                                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-bl-lg tracking-wider flex items-center space-x-1 shadow-sm z-10">
                                    <span>🔒</span>
                                    <span>Locked</span>
                                  </div>
                                )}
                                <div className="h-40 w-full overflow-hidden relative">
                                  <img src={getListingImage(tender)} alt={tender.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-4 p-5">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                      {TENDER_CATEGORY_ICONS[tender.industry] || '📋'} {tender.industry}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono font-medium">{tender.referenceNumber}</span>
                                  </div>

                                  <div>
                                    <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">{tender.title}</h3>
                                    <p className="text-xs font-bold text-slate-600 mt-1">{tender.authority}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center">
                                      <span className="mr-1">Date:</span> {tender.publishedDate}
                                    </p>
                                  </div>

                                  {userPlan === 'free' ? (
                                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center space-x-2 text-xs text-slate-500">
                                      <span>🔒</span>
                                      <span>Procurement details locked on Free Plan.</span>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tender.description}</p>
                                  )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mx-5 mb-5">
                                  <div>
                                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Estimated Budget</span>
                                    {userPlan === 'free' ? (
                                      <span className="text-xs font-bold text-slate-400">🔒 Locked</span>
                                    ) : (
                                      <span className="text-sm font-black text-slate-950">{tender.value}</span>
                                    )}
                                  </div>

                                  <div className="flex space-x-2">
                                    {userPlan === 'free' ? (
                                      <>
                                        <button
                                          onClick={() => { setUserPlan('premium'); handleShareClick("Premium Unlocked"); }}
                                          className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
                                        >
                                          Unlock with Premium
                                        </button>
                                        <Button
                                          onClick={() => { setActiveTenderDetail(tender); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                          className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm"
                                        >
                                          View (Locked)
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        onClick={() => { setActiveTenderDetail(tender); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm"
                                      >
                                        Explore Details
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>

                        <Pagination
                          currentPage={tendersPage}
                          totalItems={filteredAndSortedTenders.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          onPageChange={(page) => setTendersPage(page)}
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-slate-200 text-center py-12 px-4 shadow-sm">
                        <span className="text-4xl block mb-2">📋</span>
                        <h3 className="font-bold text-slate-950 text-base">No active procurement tenders</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                          No tenders match your current lookup criteria for {selectedTenderIndustry}. Try checking search keywords or select different filters.
                        </p>
                        <Button
                          onClick={() => { setTenderSearch(''); setSelectedTenderIndustry('All'); setSelectedTenderState('All States'); setSelectedTenderCountry('All Countries'); setSelectedTenderStatus('All'); setTenderSort('none'); setTendersPage(1); }}
                          className="mt-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                        >
                          Reset All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* VIEW: GOVERNMENT TENDERS DETAIL PAGE */}
        {currentView === 'tenders' && activeTenderDetail && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header actions */}
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setActiveTenderDetail(null)}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
              >
                &larr; Back to Listings
              </Button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleBookmark(activeTenderDetail.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                    bookmarkedItems[activeTenderDetail.id]
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {bookmarkedItems[activeTenderDetail.id] ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
                <button
                  onClick={() => handleShareClick(activeTenderDetail.title)}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Core Details Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="h-64 w-full overflow-hidden rounded-xl relative shadow-inner">
                <img src={getListingImage(activeTenderDetail)} alt={activeTenderDetail.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-2">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
                    {activeTenderDetail.industry} Industry Bid
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{activeTenderDetail.title}</h1>
                  <p className="text-sm font-semibold text-slate-600">Procurement Authority: {activeTenderDetail.authority}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Estimated Value Budget</span>
                  <span className="text-xl font-black text-amber-600">{activeTenderDetail.value}</span>
                </div>
              </div>

              {/* Informational parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Ministry</span>
                  <span className="font-bold text-slate-800">{activeTenderDetail.ministry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Department</span>
                  <span className="font-bold text-slate-800">{activeTenderDetail.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Site State & Country</span>
                  <span className="font-bold text-slate-800">{activeTenderDetail.location} ({activeTenderDetail.state}, {activeTenderDetail.country})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Bidding Deadline</span>
                  <span className="font-black text-red-600">{activeTenderDetail.deadline}</span>
                </div>
              </div>

              {userPlan === 'free' ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-fadeIn">
                  <span className="text-5xl block">🔒</span>
                  <h3 className="text-lg font-black text-slate-900">Procurement Specifications Locked</h3>
                  <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                    Full access to engineering designs, bid documents checklists, L1/T1 appraisal paths, EMD guarantee details, and the bid submission portal is restricted to Premium subscribers.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => { setUserPlan('premium'); handleShareClick("Premium Unlocked"); }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-md text-xs transition-all"
                    >
                      👑 Unlock with Premium
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Free Plan Validity: 1 Month
                  </div>
                </div>
              ) : (
                <>
                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-amber-600 pl-2">Complete Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{activeTenderDetail.description}</p>
                  </div>

                  {/* Eligibility */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-amber-600 pl-2">Minimum Bidder Qualification</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">{activeTenderDetail.eligibility}</p>
                  </div>

                  {/* Technical parameters */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-amber-600 pl-2">Technical Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                      <div>
                        <span className="font-semibold block text-slate-700">Tender Reference ID:</span>
                        <span className="font-mono text-slate-900">{activeTenderDetail.referenceNumber}</span>
                      </div>
                      <div>
                        <span className="font-semibold block text-slate-700">Published Date:</span>
                        <span>{activeTenderDetail.publishedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-amber-600 pl-2">Bid Documents Checklist</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <p className="text-xs text-slate-500 mb-1">Upload exactly formatted bid files adhering to the compliance checklists below:</p>
                      <ul className="space-y-1.5 text-slate-700 text-xs font-medium">
                        {activeTenderDetail.requiredDocuments && activeTenderDetail.requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Selection Process */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-amber-600 pl-2">Bidding & Evaluation (L1/T1 Methodology)</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{activeTenderDetail.selectionProcess}</p>
                  </div>

                  {/* Important Instructions */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-amber-600 pl-2">Important Instructions & Guarantees</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
                      <span className="font-bold block">⚠️ EMD & Fee Guidelines:</span>
                      <p>{activeTenderDetail.importantInstructions}</p>
                    </div>
                  </div>

                  {/* Actions & Dates */}
                  <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col text-xs text-slate-400 space-y-0.5">
                      <span>Bidding Status: <strong className="text-amber-600 uppercase">{activeTenderDetail.status}</strong></span>
                      <span>Official Portal Origin: <strong className="text-slate-600">{activeTenderDetail.officialSource}</strong></span>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <a
                        href={activeTenderDetail.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg text-center flex-grow sm:flex-grow-0"
                      >
                        Official Portal
                      </a>
                      <Button
                        onClick={() => handleTenderBidSubmit(activeTenderDetail.id)}
                        disabled={activeTenderDetail.status !== 'Open' || submittedBids[activeTenderDetail.id]}
                        className={`px-6 py-2.5 text-xs font-bold rounded-lg flex-grow sm:flex-grow-0 ${
                          submittedBids[activeTenderDetail.id]
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                            : activeTenderDetail.status === 'Open'
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/10'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {submittedBids[activeTenderDetail.id] ? '✓ Bid Submitted' : activeTenderDetail.status === 'Open' ? 'Place Bid' : 'Closed'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Related opportunities */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Related Bidding Tenders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedTenders.map((rt) => (
                  <Card key={rt.id} className="p-4 border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {rt.industry} Industry
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">{rt.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rt.authority}</p>
                    </div>
                    <Button
                      onClick={() => { setActiveTenderDetail(rt); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="mt-4 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 w-full py-1.5"
                    >
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: GOVERNMENT FUNDING */}
        {currentView === 'funding' && !activeFundingDetail && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Government Schemes & Incubators</h1>
              <p className="text-slate-500 text-sm mt-1">
                Apply for eco-agricultural subsidies, MSME loan guarantees, and manufacturing PLIs across 9 sectors.
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="relative md:col-span-2">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter grants..."
                  value={fundingSearch}
                  onChange={(e) => { setFundingSearch(e.target.value); setFundingPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Class Sector filter */}
              <div>
                <select
                  value={selectedFundingSector}
                  onChange={(e) => { setSelectedFundingSector(e.target.value); setFundingPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Sectors</option>
                  {fundingSectors.slice(1).map((sector) => (
                    <option key={sector} value={sector}>{sector} Schemes</option>
                  ))}
                </select>
              </div>

              {/* State filter */}
              <div>
                <select
                  value={selectedFundingState}
                  onChange={(e) => { setSelectedFundingState(e.target.value); setFundingPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Country filter */}
              <div>
                <select
                  value={selectedFundingCountry}
                  onChange={(e) => { setSelectedFundingCountry(e.target.value); setFundingPage(1); }}
                  className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order filter */}
              <div>
                <select
                  value={fundingSort}
                  onChange={(e) => { setFundingSort(e.target.value as SortOption); setFundingPage(1); }}
                  className="w-full border border-blue-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-800 font-bold"
                >
                  <option value="none">Sort By Default</option>
                  <option value="deadline-asc">Deadline (Ascending)</option>
                  <option value="deadline-desc">Deadline (Descending)</option>
                  <option value="budget-desc">Grant Size (Highest First)</option>
                  <option value="budget-asc">Grant Size (Lowest First)</option>
                  <option value="title-asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Funding Grid */}
            {paginatedFunding.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paginatedFunding.map((fund) => {
                    return (
                      <Card key={fund.id} className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200/80 relative overflow-hidden bg-white p-0">
                        {userPlan === 'free' && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-bl-lg tracking-wider flex items-center space-x-1 shadow-sm z-10">
                            <span>🔒</span>
                            <span>Locked</span>
                          </div>
                        )}
                        <div className="h-40 w-full overflow-hidden relative">
                          <img src={getListingImage(fund)} alt={fund.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-4 p-5">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                            {fund.sector} Support
                          </span>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 line-clamp-2">{fund.title}</h3>
                            <p className="text-xs font-semibold text-slate-600 mt-1">{fund.ministry}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Date: {fund.publishedDate}</p>
                          </div>

                          {userPlan === 'free' ? (
                            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center space-x-2 text-xs text-slate-500">
                              <span>🔒</span>
                              <span>Funding objectives locked on Free Plan.</span>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{fund.description}</p>
                          )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col space-y-3 mx-5 mb-5">
                          <div className="bg-slate-50 p-2.5 rounded text-xs">
                            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px]">Eligible Target</span>
                            {userPlan === 'free' ? (
                              <span className="text-xs font-bold text-slate-400">🔒 Locked</span>
                            ) : (
                              <span className="font-semibold text-slate-700 line-clamp-1">{fund.eligibility}</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {userPlan === 'free' ? (
                              <span className="text-xs font-bold text-slate-400">🔒 Locked</span>
                            ) : (
                              <span className="text-sm font-black text-emerald-600">{fund.amount}</span>
                            )}
                            <div className="flex space-x-1.5">
                              {userPlan === 'free' ? (
                                <>
                                  <button
                                    onClick={() => { setUserPlan('premium'); handleShareClick("Premium Unlocked"); }}
                                    className="px-2.5 py-1.5 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
                                  >
                                    Unlock with Premium
                                  </button>
                                  <Button
                                    onClick={() => { setActiveFundingDetail(fund); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="px-2.5 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                                  >
                                    View (Locked)
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => { setActiveFundingDetail(fund); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                  className="px-2.5 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                                >
                                  Explore Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={fundingPage}
                  totalItems={filteredAndSortedFunding.length}
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
                  onClick={() => { setFundingSearch(''); setSelectedFundingSector('All'); setSelectedFundingState('All States'); setSelectedFundingCountry('All Countries'); setSelectedFundingStatus('All'); setFundingSort('none'); setFundingPage(1); }}
                  className="mt-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: GOVERNMENT FUNDING DETAIL PAGE */}
        {currentView === 'funding' && activeFundingDetail && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header actions */}
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setActiveFundingDetail(null)}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
              >
                &larr; Back to Listings
              </Button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleBookmark(activeFundingDetail.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                    bookmarkedItems[activeFundingDetail.id]
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {bookmarkedItems[activeFundingDetail.id] ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
                <button
                  onClick={() => handleShareClick(activeFundingDetail.title)}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Core Details Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="h-64 w-full overflow-hidden rounded-xl relative shadow-inner">
                <img src={getListingImage(activeFundingDetail)} alt={activeFundingDetail.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
                    {activeFundingDetail.sector} Class Scheme
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{activeFundingDetail.title}</h1>
                  <p className="text-sm font-semibold text-slate-600">Ministry: {activeFundingDetail.ministry}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Scheme Funding Capital</span>
                  <span className="text-xl font-black text-emerald-600">{activeFundingDetail.amount}</span>
                </div>
              </div>

              {/* Informational parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Department</span>
                  <span className="font-bold text-slate-800">{activeFundingDetail.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Jurisdiction</span>
                  <span className="font-bold text-slate-800">{activeFundingDetail.state} ({activeFundingDetail.country})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Enrollment Status</span>
                  <span className="font-black text-emerald-600">{activeFundingDetail.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase tracking-wider text-[9px] mb-0.5">Application Deadline</span>
                  <span className="font-black text-red-600">{activeFundingDetail.deadline}</span>
                </div>
              </div>

              {userPlan === 'free' ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-fadeIn">
                  <span className="text-5xl block">🔒</span>
                  <h3 className="text-lg font-black text-slate-900">Grant Details Locked</h3>
                  <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                    Full access to detailed benefit breakdowns, application checklists, milestone distribution compliance rules, official scheme portals, and direct enrollment forms is restricted to Premium subscribers.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => { setUserPlan('premium'); handleShareClick("Premium Unlocked"); }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-md text-xs transition-all"
                    >
                      👑 Unlock with Premium
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Free Plan Validity: 1 Month
                  </div>
                </div>
              ) : (
                <>
                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">Program Objective</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{activeFundingDetail.description}</p>
                  </div>

                  {/* Eligibility */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">Target Eligibility Criteria</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">{activeFundingDetail.eligibility}</p>
                  </div>

                  {/* Scheme benefits list */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">Direct Advantages & Benefits</h3>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm">
                      {activeFundingDetail.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">Appraisal Documents Checklist</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <p className="text-xs text-slate-500 mb-1">Upload the following details checklist before the validation cycle starts:</p>
                      <ul className="space-y-1.5 text-slate-700 text-xs font-medium">
                        {activeFundingDetail.requiredDocuments && activeFundingDetail.requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Selection Process */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">Incubation & Validation Cycle</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{activeFundingDetail.selectionProcess}</p>
                  </div>

                  {/* Important Instructions */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">Important Instructions & Compliance</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
                      <span className="font-bold block">⚠️ Milestones & Allocations:</span>
                      <p>{activeFundingDetail.importantInstructions}</p>
                    </div>
                  </div>

                  {/* Actions & Dates */}
                  <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col text-xs text-slate-400 space-y-0.5">
                      <span>Published Date: <strong>{activeFundingDetail.publishedDate}</strong></span>
                      <span>Scheme Source Gazette: <strong className="text-slate-600">{activeFundingDetail.officialSource}</strong></span>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <a
                        href={activeFundingDetail.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-center flex-grow sm:flex-grow-0"
                      >
                        Official Portal
                      </a>
                      <Button
                        onClick={() => handleGrantApplySubmit(activeFundingDetail.id)}
                        className={`px-6 py-2.5 text-xs font-bold rounded-lg flex-grow sm:flex-grow-0 ${
                          appliedGrants[activeFundingDetail.id]
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {appliedGrants[activeFundingDetail.id] ? '✓ Enrolled' : 'Apply Scheme'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Related opportunities */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Related Schemes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedFunding.map((rf) => (
                  <Card key={rf.id} className="p-4 border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {rf.sector} Class
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">{rf.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rf.ministry}</p>
                    </div>
                    <Button
                      onClick={() => { setActiveFundingDetail(rf); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="mt-4 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 w-full py-1.5"
                    >
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
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
                        className="text-[10px] font-bold mt-2 text-slate-700 bg-slate-100 hover:bg-slate-200"
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
                <li><button onClick={() => { setCurrentView('jobs'); setJobSearch(''); setSelectedJobCategory('All'); setSelectedJobState('All States'); setSelectedJobCountry('All Countries'); setSelectedJobStatus('All'); setJobSort('none'); setJobsPage(1); setActiveJobDetail(null); }} className="hover:text-white transition-colors">Search Jobs</button></li>
                <li><button onClick={() => { setCurrentView('tenders'); setTenderSearch(''); setSelectedTenderIndustry('All'); setSelectedTenderState('All States'); setSelectedTenderCountry('All Countries'); setSelectedTenderStatus('All'); setTenderSort('none'); setTendersPage(1); setActiveTenderDetail(null); }} className="hover:text-white transition-colors">Review Bids</button></li>
                <li><button onClick={() => { setCurrentView('funding'); setFundingSearch(''); setSelectedFundingSector('All'); setSelectedFundingState('All States'); setSelectedFundingCountry('All Countries'); setSelectedFundingStatus('All'); setFundingSort('none'); setFundingPage(1); setActiveFundingDetail(null); }} className="hover:text-white transition-colors">Apply for Funding</button></li>
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
