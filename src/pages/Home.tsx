import { ArrowRight, Briefcase, FileText, Landmark } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-12 py-6 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <Landmark className="w-3.5 h-3.5" /> Official Government Services Portal
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Access Opportunities & Resources from <span className="text-blue-600">Unified Portal</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Your centralized Gateway to find certified Government Jobs, participate in open Government Tenders, and discover non-dilutive Government Funding options.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Explore Jobs <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() => onNavigate('tenders')}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition border border-slate-200"
          >
            View Active Tenders
          </button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {/* Jobs Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Government Jobs</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Discover active vacancies across public sector undertakings, ministries, and civil services. Apply with trusted credentials directly.
          </p>
          <button
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 gap-1"
          >
            Browse vacancies <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tenders Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Government Tenders</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Participate in open public procurement bidding. Track ongoing tenders, e-procurement contracts, and standard operating requests.
          </p>
          <button
            onClick={() => onNavigate('tenders')}
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-800 gap-1"
          >
            Browse tenders <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Funding Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Government Funding</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Find financial grants, business development subsidies, R&D sponsorships, and non-dilutive government funding programs.
          </p>
          <button
            onClick={() => onNavigate('funding')}
            className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-800 gap-1"
          >
            Explore grants <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Quick stats section */}
      <section className="bg-slate-900 text-white py-12 rounded-3xl max-w-6xl mx-auto px-6 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Portal Vital Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">12,500+</div>
            <div className="text-xs md:text-sm text-slate-400 mt-2 font-medium">Verified Active Jobs</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">$2.4B+</div>
            <div className="text-xs md:text-sm text-slate-400 mt-2 font-medium">Active Procurement Budget</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">450+</div>
            <div className="text-xs md:text-sm text-slate-400 mt-2 font-medium">Open Grant Allocations</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">99.9%</div>
            <div className="text-xs md:text-sm text-slate-400 mt-2 font-medium">Uptime Guarantee</div>
          </div>
        </div>
      </section>
    </div>
  );
}
