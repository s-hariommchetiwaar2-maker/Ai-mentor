import React from "react";
import Link from "next/link";
import { Landmark, Briefcase, FileText, Gift, ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react";
import JsonLdSchema from "@/components/JsonLdSchema";

export const metadata = {
  title: "Central Government Portals — Gov Jobs, Tenders & Funding",
  description: "Direct official directories for UPSC careers, central e-procurement (CPPP) tenders, Startup India seed capital, and national MSME subsidies.",
};

const centralPortals = [
  {
    category: "Government Careers",
    icon: <Briefcase className="w-5 h-5 text-blue-900" />,
    items: [
      {
        name: "Union Public Service Commission (UPSC)",
        url: "https://www.upsc.gov.in",
        purpose: "Gazetted civil, administrative, police, forest, and economic services careers.",
        domain: "upsc.gov.in"
      },
      {
        name: "Staff Selection Commission (SSC)",
        url: "https://ssc.gov.in",
        purpose: "Group B & C technical and administrative positions for central ministries and organizations.",
        domain: "ssc.gov.in"
      },
      {
        name: "Railway Recruitment Boards (RRB)",
        url: "https://www.rrcb.gov.in",
        purpose: "Technical, operational, and general logistics openings in the Indian Railways.",
        domain: "rrcb.gov.in"
      },
      {
        name: "National Career Service (NCS)",
        url: "https://www.ncs.gov.in",
        purpose: "Unified national job-seeker registration, counseling, and employment listings.",
        domain: "ncs.gov.in"
      }
    ]
  },
  {
    category: "Government Tenders",
    icon: <FileText className="w-5 h-5 text-emerald-700" />,
    items: [
      {
        name: "Central Public Procurement Portal (CPPP)",
        url: "https://etenders.gov.in",
        purpose: "Centralized bidding platform for all ministries, public departments, and defence projects.",
        domain: "etenders.gov.in"
      },
      {
        name: "Government e-Marketplace (GeM)",
        url: "https://gem.gov.in",
        purpose: "Authorized procurement portal for day-to-day services and standardized products for government offices.",
        domain: "gem.gov.in"
      },
      {
        name: "National Highways Authority (NHAI) eProcure",
        url: "https://etenders.gov.in/eprocure/app",
        purpose: "Expressways, national highway networks, smart infrastructure development, and corridor bids.",
        domain: "etenders.gov.in"
      },
      {
        name: "Defence eProcurement Portal",
        url: "https://defproc.gov.in",
        purpose: "Aeronautics, ordnance supplies, army base logistics, and heavy military engineering bids.",
        domain: "defproc.gov.in"
      }
    ]
  },
  {
    category: "Government Funding & Subsidies",
    icon: <Gift className="w-5 h-5 text-amber-600" />,
    items: [
      {
        name: "Startup India Portal",
        url: "https://www.startupindia.gov.in",
        purpose: "National incubator registry, equity-free seed funds, income tax exemptions, and investor networks.",
        domain: "startupindia.gov.in"
      },
      {
        name: "Ministry of MSME Portal",
        url: "https://msme.gov.in",
        purpose: "Collateral-free business credits, interest subvention, industrial clustering, and modernization subsidies.",
        domain: "msme.gov.in"
      },
      {
        name: "NABARD Agriculture Funding",
        url: "https://www.nabard.org",
        purpose: "Agricultural infrastructure funding, rural warehousing grants, and dairy/irrigation technology subsidies.",
        domain: "nabard.org"
      },
      {
        name: "DST Scientific Research Grants",
        url: "https://dst.gov.in",
        purpose: "R&D labs funding, research fellowships, international innovations partnerships, and patent facilitation.",
        domain: "dst.gov.in"
      }
    ]
  }
];

export default function CentralPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold mb-3">
            <Landmark className="w-3.5 h-3.5" />
            <span>Central Government Ministries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Central Government Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            Consolidated authorized sources managed by Union Ministries of India. These directories route you directly to secure national application forms, tender documentation downloads, and startup schemes registering offices.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 max-w-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-800 leading-relaxed font-semibold">
            All listed domains are checked daily to ensure perfect security and correct redirect paths for citizen convenience.
          </p>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="space-y-10">
        {centralPortals.map((group) => (
          <div key={group.category} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 pb-3">
              {group.icon}
              <h2 className="text-lg font-bold text-gray-900">{group.category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white rounded-xl p-4 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-900 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {item.purpose}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100/70 mt-4 pt-3 text-xs">
                    <span className="text-gray-400 font-mono text-[10px]">
                      Domain: {item.domain}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-blue-900 hover:text-blue-700 hover:underline"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SEO Schema */}
      <JsonLdSchema
        type="GovernmentService"
        data={{
          serviceName: "Central Government Portals Directory",
          description: "Authorized directory routing users to official centralized job, tender, and MSME funding registries in India.",
        }}
      />
    </div>
  );
}