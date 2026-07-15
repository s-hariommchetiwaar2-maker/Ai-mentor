import { useState } from 'react';
import { Award, ArrowUpRight } from 'lucide-react';

interface Funding {
  id: string;
  title: string;
  category: string;
  maxAmount: string;
  eligibility: string;
  description: string;
  department: string;
}

const FUNDING_DATA: Funding[] = [
  {
    id: 'F-101',
    title: 'SBIR Phase I: Small Business Innovation Research Grant',
    category: 'Technology & Innovation',
    maxAmount: '$275,000',
    eligibility: 'U.S.-based technology startups with under 500 employees',
    description: 'Provides non-dilutive funds for early-stage scientific and technical projects with commercial potential.',
    department: 'National Science Foundation',
  },
  {
    id: 'F-102',
    title: 'Clean Energy & Decarbonization Subsidy Program',
    category: 'Environment & Climate',
    maxAmount: '$1,500,000',
    eligibility: 'Manufacturing firms implementing carbon-neutral conversions',
    description: 'Subsidizes transition to sustainable energy infrastructure, including hydrogen fuels and commercial solar conversion.',
    department: 'Department of Energy',
  },
  {
    id: 'F-103',
    title: 'Rural Community Broadband Expansion Subsidy',
    category: 'Infrastructure',
    maxAmount: '$5,000,000',
    eligibility: 'Local ISPs & Municipal utilities targeting underserved zones',
    description: 'Supports high-speed fiber-optic rollout initiatives in unincorporated or rural geographic locations.',
    department: 'Department of Agriculture',
  },
  {
    id: 'F-104',
    title: 'Biotech Therapeutic Innovation Partnership Grant',
    category: 'Healthcare & Science',
    maxAmount: '$2,000,000',
    eligibility: 'Non-profit research entities & accredited universities',
    description: 'Encourages translation of biomedical breakthroughs into actionable clinical diagnostics and medicines.',
    department: 'National Institutes of Health',
  }
];

export default function GovernmentFunding() {
  const [search] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology & Innovation', 'Environment & Climate', 'Infrastructure', 'Healthcare & Science'];

  const filteredFunding = FUNDING_DATA.filter(funding => {
    const matchesSearch = funding.title.toLowerCase().includes(search.toLowerCase()) ||
                          funding.description.toLowerCase().includes(search.toLowerCase()) ||
                          funding.department.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || funding.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Government Grants & Funding</h1>
        <p className="text-slate-600">Explore non-dilutive government funding, subsidies, and research grants designed to foster growth and innovation.</p>
      </div>

      {/* Categories slider */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Funding list */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredFunding.length > 0 ? (
          filteredFunding.map((fund) => (
            <div key={fund.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                    {fund.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">ID: {fund.id}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">{fund.title}</h2>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{fund.department}</p>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">{fund.description}</p>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider">Maximum Amount</span>
                    <span className="text-base font-extrabold text-emerald-600">{fund.maxAmount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider">Eligibility Criteria</span>
                    <span className="text-slate-700 font-medium">{fund.eligibility}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition gap-1.5 shadow-sm">
                  Apply for Grant <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No funding opportunities match your search selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
