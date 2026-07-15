import { useState } from 'react';
import { Search, Briefcase, MapPin, Calendar, DollarSign, Filter, ExternalLink } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryRange: string;
  deadline: string;
  type: string;
  tags: string[];
}

const JOBS_DATA: Job[] = [
  {
    id: '1',
    title: 'Senior Cybersecurity Specialist',
    department: 'Department of Homeland Security',
    location: 'Washington, DC (Hybrid)',
    salaryRange: '$120,000 - $165,000 / year',
    deadline: '2025-05-15',
    type: 'Full-time',
    tags: ['Cybersecurity', 'IT', 'Security Clearance Required'],
  },
  {
    id: '2',
    title: 'Environmental Protection Engineer',
    department: 'Environmental Protection Agency',
    location: 'Denver, CO (On-site)',
    salaryRange: '$92,000 - $125,000 / year',
    deadline: '2025-06-01',
    type: 'Full-time',
    tags: ['Engineering', 'Environmental', 'GS-13'],
  },
  {
    id: '3',
    title: 'Data Analyst / Statistician',
    department: 'Bureau of Labor Statistics',
    location: 'Remote',
    salaryRange: '$78,000 - $110,000 / year',
    deadline: '2025-05-20',
    type: 'Remote',
    tags: ['Data Science', 'Statistics', 'Remote-friendly'],
  },
  {
    id: '4',
    title: 'Public Health Research Associate',
    department: 'Centers for Disease Control and Prevention',
    location: 'Atlanta, GA (Hybrid)',
    salaryRange: '$65,000 - $88,000 / year',
    deadline: '2025-05-30',
    type: 'Contract',
    tags: ['Healthcare', 'Research', 'CDC'],
  },
  {
    id: '5',
    title: 'Civil Engineering Project Manager',
    department: 'Army Corps of Engineers',
    location: 'Seattle, WA (On-site)',
    salaryRange: '$105,000 - $140,000 / year',
    deadline: '2025-06-15',
    type: 'Full-time',
    tags: ['Engineering', 'Project Management', 'Infrastructure'],
  }
];

export default function GovernmentJobs() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredJobs = JOBS_DATA.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                          job.department.toLowerCase().includes(search.toLowerCase()) ||
                          job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'All' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Government Careers Portal</h1>
        <p className="text-slate-600">Find stable, impactful career options across civil agencies, departments, and public services.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search roles, departments, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Vacancy List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 pt-1">{job.title}</h2>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Apply by: {job.deadline}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 lg:self-center">
                  <button className="flex-1 lg:flex-none inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition gap-1.5 shadow-sm">
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No careers matched your current search parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
