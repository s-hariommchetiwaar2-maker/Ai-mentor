import React from "react";
import SearchDashboard from "@/components/SearchDashboard";
import Link from "next/link";
import { Landmark, Briefcase, FileText, Gift, ChevronRight, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white py-16 sm:py-24">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/50 mb-6 animate-fade-in text-xs sm:text-sm font-semibold text-blue-200">
            <ShieldCheck className="w-4 h-4 text-gov-orange" />
            <span>Phase 1 Consolidated Portal — 100% Verified Official Sources</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
            Gov Jobs, Tenders <span className="text-gov-orange">&</span> Funding
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 mb-10 leading-relaxed font-medium">
            The national discovery portal to securely search, explore and access authentic public sector careers, central/state e-tenders, and startup funding programs. Unified coverage across 28 Indian States and Union Territories.
          </p>

          {/* Core Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-blue-900/80 p-2 rounded-lg text-white">
                <Briefcase className="w-5 h-5 text-gov-orange" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Government Careers</h3>
                <p className="text-xs text-slate-400 mt-1">UPSC, SSC, State PSC exams, and public bank recruitment portals.</p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-emerald-950/80 p-2 rounded-lg text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Procurement Contracts</h3>
                <p className="text-xs text-slate-400 mt-1">State and central level civil works, defense, and IT tenders.</p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-amber-950/80 p-2 rounded-lg text-amber-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Startup & MSME Funds</h3>
                <p className="text-xs text-slate-400 mt-1">Equity-free seed capital, research grants, and MSME interest subsidies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dynamic Navigation Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-blue-900" />
            <span>Targeted Portals</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jobs Card */}
            <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Government Careers</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Direct access to State Public Service Commissions (PSC) and Central UPSC portals. Cleanly explore categories like Civil Services, Banking, Defense, and Education.
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline mt-2"
              >
                <span>Browse Vacancies Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Tenders Card */}
            <div className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="bg-emerald-50 text-emerald-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Government Tenders</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Participate in infrastructure bids, heavy supply contracts, IT services, and healthcare equipments procurement. Filtered and linked directly back to the eTenders system.
                </p>
              </div>
              <Link
                href="/tenders"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline mt-2"
              >
                <span>Browse Tenders Directory</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Funding Card */}
            <div className="bg-white rounded-2xl border border-gray-200 hover:border-amber-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="bg-amber-50 text-amber-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Startup & MSME Funding</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Discover state-sponsored incubation schemes, DST research grants, low-interest MSME capital assistance, and organic farming agricultural conversion subsidies.
                </p>
              </div>
              <Link
                href="/funding"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline mt-2"
              >
                <span>Browse Funding Schemes</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Dashboard */}
        <div className="mb-12">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">State & Union Territory Directory</h2>
              <p className="text-xs text-gray-500 mt-1">Filter, search and instantly access official recruitment, e-tender, and start-up portals.</p>
            </div>
            <Link
              href="/central"
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-xl shadow-sm transition-colors shrink-0"
            >
              <Landmark className="w-4 h-4" />
              <span>Explore Central Government Portals</span>
            </Link>
          </div>

          <SearchDashboard />
        </div>

        {/* Quality Guidelines Card */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4 mb-8">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100 shrink-0">
            <ShieldCheck className="w-8 h-8 text-blue-900" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">Our Core Commitment to Integrity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We never host third-party applications, charge search facilitation fees, or generate fake jobs, bids, or grant entries. Every single link connects the user to either standard `.nic.in`, `.gov.in` domains or authorized state corporation sites.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-gray-700 font-semibold">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UPSC & State PSC Authorized Catalogs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Central Public Procurement (CPPP) Sync</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Department for MSME Policy Links</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct State-wise Union Territory Mapping</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}