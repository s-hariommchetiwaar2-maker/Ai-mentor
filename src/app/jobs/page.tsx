import React from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, ExternalLink, ShieldCheck, Landmark } from "lucide-react";
import { categories } from "@/data/categories";
import JsonLdSchema from "@/components/JsonLdSchema";

export const metadata = {
  title: "Government Jobs Directory — UPSC, SSC, Banking & Defense Careers",
  description: "Browse official public sector career opportunities. Access certified portals for UPSC, Staff Selection Commission (SSC), Banking exams (IBPS), and State Public Service Commissions.",
};

export default function JobsPage() {
  const jobsCategory = categories.find((c) => c.id === "jobs");

  if (!jobsCategory) return null;

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

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Employment Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {jobsCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed max-w-3xl">
            {jobsCategory.description} All pathways listed on this directory link directly to the respective recruitment commission’s official secure website.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 max-w-sm shrink-0">
          <ShieldCheck className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-950 leading-relaxed font-semibold">
            Always verify that you are on `.gov.in` or `.nic.in` websites when entering personal credentials.
          </p>
        </div>
      </div>

      {/* Grid of Subcategories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {jobsCategory.subcategories.map((sub) => (
          <div key={sub.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {sub.name}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {sub.description}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-gray-500 font-medium leading-normal">
                Official Sources: <strong className="text-gray-800">{sub.officialSource}</strong>
              </span>

              <Link
                href="/#search-section"
                className="inline-flex items-center gap-1 font-bold text-blue-900 hover:text-blue-700 hover:underline whitespace-nowrap"
              >
                <span>Filter States PSC</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Central Board List Section */}
      <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-blue-900" />
          <span>Top Primary Central Recruitment Portals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://www.upsc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-blue-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">UPSC Careers</span>
              <span className="text-[10px] text-gray-400 font-mono">upsc.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-900" />
          </a>

          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-blue-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">SSC Staff Selection</span>
              <span className="text-[10px] text-gray-400 font-mono">ssc.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-900" />
          </a>

          <a
            href="https://www.ibps.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-blue-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">IBPS Bank Exams</span>
              <span className="text-[10px] text-gray-400 font-mono">ibps.co.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-900" />
          </a>

          <a
            href="https://www.rrcb.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-blue-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">Railways Recruitment</span>
              <span className="text-[10px] text-gray-400 font-mono">rrcb.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-900" />
          </a>
        </div>
      </div>

      {/* SEO Schema */}
      <JsonLdSchema
        type="GovernmentService"
        data={{
          serviceName: "Government Jobs Directory India",
          description: "Browse verified central and state public services commissions, exams, and vacancies in India.",
        }}
      />
    </div>
  );
}