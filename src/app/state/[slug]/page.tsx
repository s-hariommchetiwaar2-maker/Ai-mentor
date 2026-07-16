import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { statesAndUTs } from "@/data/states";
import { ArrowLeft, Landmark, Briefcase, FileText, Gift, MapPin, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import JsonLdSchema from "@/components/JsonLdSchema";

interface StatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-generate static params for all 28 states + 3 UTs listed in our model for SEO pre-rendering
export async function generateStaticParams() {
  return statesAndUTs.map((state) => ({
    slug: state.id,
  }));
}

export async function generateMetadata({ params }: StatePageProps) {
  const resolvedParams = await params;
  const state = statesAndUTs.find((s) => s.id === resolvedParams.slug);

  if (!state) {
    return {
      title: "State Portal Not Found",
    };
  }

  return {
    title: `${state.name} Gov Jobs, Tenders & Funding Portals — Verified Directory`,
    description: `Official direct links to the ${state.name} State Government website, Public Service Commission recruitment, e-procurement tenders, and MSME/startup funding programs.`,
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const resolvedParams = await params;
  const state = statesAndUTs.find((s) => s.id === resolvedParams.slug);

  if (!state) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory Directory</span>
      </Link>

      {/* Header Profile */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-3 rounded-2xl shadow-inner">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {state.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                  {state.isUT ? "Union Territory" : "Indian State"}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                Capital City: <strong className="text-gray-700">{state.capital}</strong>
              </p>
            </div>
          </div>

          <a
            href={state.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <span>Visit Official State Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 max-w-4xl">
          {state.description} Below is the consolidated listing of directories owned and operated by the {state.name} administration for public career examinations, procurement tender notices, and local enterprise funding schemes.
        </p>
      </div>

      {/* Official Directory Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Jobs Portal Card */}
        <div className="bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
          <div>
            <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
              State Careers & PSC
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Official job openings, civil exams timetable, syllabus downloads, and teacher recruitment alerts in {state.name}.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-mono">Verified Link</span>
            <a
              href={state.recruitmentWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline"
            >
              <span>Explore Commission</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tenders Portal Card */}
        <div className="bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
          <div>
            <div className="bg-emerald-50 text-emerald-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
              eProcurement Tenders
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Direct access to public work contracts, highway construction bids, and department supplies RFPs in {state.name}.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-mono">Verified Link</span>
            <a
              href={state.tenderWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              <span>View eTenders</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Funding Portal Card */}
        <div className="bg-white border border-gray-200 hover:border-amber-300 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
          <div>
            <div className="bg-amber-50 text-amber-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-800 transition-colors">
              MSME & Startup Funding
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Access local incubation programs, state seed capital schemes, and industrial microenterprise capital incentives in {state.name}.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-mono">Verified Link</span>
            <a
              href={state.fundingWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              <span>Explore Grants</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Industrial Key Sectors Profile */}
      <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8">
        <h3 className="text-base sm:text-lg font-bold text-gray-950 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5.5 h-5.5 text-blue-900" />
          <span>Primary Economic & Industrial Focus Sectors</span>
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-6">
          The {state.name} Government organizes targeted procurement campaigns and custom funding programs around these prominent local industry domains:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {state.keySectors.map((sector) => (
            <div key={sector} className="bg-white border border-gray-200 rounded-xl p-3 shadow-inner text-center">
              <span className="font-bold text-xs text-gray-800">{sector}</span>
            </div>
          ))}
        </div>
      </div>

      {/* State-specific Integrity Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm shrink-0 border border-blue-100">
          <ShieldCheck className="w-8 h-8 text-blue-900" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">State Integrity Assurance</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            All three directory buttons lead directly to the authenticated state domains (`.gov.in` or `.nic.in` or specific registered corporations). We suggest that users check the lock icon in their browser address bar before interacting with any web forms.
          </p>
        </div>
      </div>

      {/* SEO Schema */}
      <JsonLdSchema
        type="GovernmentService"
        data={{
          serviceName: `${state.name} State Portal Directory`,
          description: `Consolidated directory of official, verified recruitment, e-procurement, and startup funding portals for ${state.name}.`,
          provider: {
            "@type": "GovernmentOrganization",
            "name": `${state.name} State Government`,
          }
        }}
      />
    </div>
  );
}