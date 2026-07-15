import { useState } from 'react';
import { Search, ShieldCheck, Download, AlertTriangle } from 'lucide-react';

interface Tender {
  id: string;
  referenceNo: string;
  title: string;
  agency: string;
  estimatedValue: string;
  publishDate: string;
  closingDate: string;
  status: 'Open' | 'Under Review' | 'Closed';
}

const TENDERS_DATA: Tender[] = [
  {
    id: 'T-2025-001',
    referenceNo: 'RFP-HUD-2025-09',
    title: 'Affordable Housing ERP Management System Implementation',
    agency: 'Department of Housing and Urban Development',
    estimatedValue: '$3,400,000',
    publishDate: '2025-04-10',
    closingDate: '2025-05-25',
    status: 'Open',
  },
  {
    id: 'T-2025-002',
    referenceNo: 'RFP-DOT-2025-42',
    title: 'Autonomous Smart Traffic Controller Grid Phase II',
    agency: 'Department of Transportation',
    estimatedValue: '$12,500,000',
    publishDate: '2025-04-18',
    closingDate: '2025-06-10',
    status: 'Open',
  },
  {
    id: 'T-2025-003',
    referenceNo: 'RFP-VA-2025-11',
    title: 'Veteran Health Care Center Modernization Equipment',
    agency: 'Department of Veterans Affairs',
    estimatedValue: '$7,800,000',
    publishDate: '2025-03-01',
    closingDate: '2025-05-02',
    status: 'Under Review',
  },
  {
    id: 'T-2025-004',
    referenceNo: 'RFP-NASA-2025-02',
    title: 'Supercomputing Infrastructure Thermal Protection Maintenance',
    agency: 'National Aeronautics and Space Administration',
    estimatedValue: '$18,000,000',
    publishDate: '2025-04-20',
    closingDate: '2025-06-30',
    status: 'Open',
  }
];

export default function GovernmentTenders() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredTenders = TENDERS_DATA.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(search.toLowerCase()) ||
                          tender.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
                          tender.agency.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || tender.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Procurement Tenders</h1>
        <p className="text-slate-600">Review open government solicitations, e-bidding processes, and procurement opportunities.</p>
      </div>

      {/* Tender Search & Status filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reference numbers, agencies, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tender List */}
      <div className="space-y-4">
        {filteredTenders.length > 0 ? (
          filteredTenders.map((tender) => (
            <div key={tender.id} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      Ref: {tender.referenceNo}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      tender.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      tender.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {tender.status}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-snug">{tender.title}</h2>

                  <p className="text-sm font-semibold text-slate-700">{tender.agency}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 pt-1">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Estimated Value</span>
                      <span className="text-sm font-bold text-slate-800">{tender.estimatedValue}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Published Date</span>
                      <span className="text-sm font-medium text-slate-600">{tender.publishDate}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Closing Date</span>
                      <span className="text-sm font-semibold text-slate-900">{tender.closingDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
                  <button className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition rounded-lg gap-2">
                    <Download className="w-4 h-4" /> Download RFP Document
                  </button>
                  <button
                    disabled={tender.status !== 'Open'}
                    className={`flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold rounded-lg transition gap-1.5 shadow-sm ${
                      tender.status === 'Open'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Submit Proposal
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No tenders matched your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
