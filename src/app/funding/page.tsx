import React from "react";
import Link from "next/link";
import { ArrowLeft, Gift, ExternalLink, ShieldCheck, Landmark } from "lucide-react";
import { categories } from "@/data/categories";
import JsonLdSchema from "@/components/JsonLdSchema";

export const metadata = {
  title: "Government Funding & Subsidies Directory — Startups, MSME & R&D Grants",
  description: "Browse verified government start-up seed capital, equity-free scientific research grants, interest-free MSME credits, and national agriculture subsidies.",
};

export default function FundingPage() {
  const fundingCategory = categories.find((c) => c.id === "funding");

  if (!fundingCategory) return null;

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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-100 rounded-full text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>Grants & Subsidies Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {fundingCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed max-w-3xl">
            {fundingCategory.description} All programs and policies listed on this directory link directly to the respective department&apos;s official scheme details and online registration portals.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 max-w-sm shrink-0">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed font-semibold">
            Funding support registration is strictly free from hidden processing fees. Only apply through designated official channels.
          </p>
        </div>
      </div>

      {/* Grid of Subcategories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {fundingCategory.subcategories.map((sub) => (
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
                className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-800 hover:underline whitespace-nowrap"
              >
                <span>Filter States Funding</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Central Platforms Section */}
      <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-700" />
          <span>Top Primary Central Funding & Policy Platforms</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://www.startupindia.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-amber-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">Startup India Portal</span>
              <span className="text-[10px] text-gray-400 font-mono">startupindia.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-700" />
          </a>

          <a
            href="https://msme.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-amber-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">Ministry of MSME</span>
              <span className="text-[10px] text-gray-400 font-mono">msme.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-700" />
          </a>

          <a
            href="https://dst.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-amber-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">DST Research Grants</span>
              <span className="text-[10px] text-gray-400 font-mono">dst.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-700" />
          </a>

          <a
            href="https://www.nabard.org"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-amber-300 p-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-xs text-gray-800 block">NABARD Rural Support</span>
              <span className="text-[10px] text-gray-400 font-mono">nabard.org</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-700" />
          </a>
        </div>
      </div>

      {/* SEO Schema */}
      <JsonLdSchema
        type="GovernmentService"
        data={{
          serviceName: "Government Funding Directory India",
          description: "Browse verified funding and subsidy policies offered by central and state ministries in India.",
        }}
      />
    </div>
  );
}