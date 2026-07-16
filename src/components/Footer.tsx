import React from "react";
import Link from "next/link";
import { Landmark, ShieldAlert, Heart, ExternalLink, HelpCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-blue-900">
      {/* Disclaimer Box */}
      <div className="bg-amber-950 border-b border-amber-900/50 px-4 py-3 text-center text-xs text-amber-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Official Source Disclaimer:</strong> GovPortal India is an independent resource platform. It is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Government of India or any of its states. All links lead directly to official `.gov.in` or registered government sites for transparency.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-blue-950 text-white p-2 rounded-lg">
                <Landmark className="w-6 h-6 text-gov-orange" />
              </div>
              <span className="text-lg font-bold tracking-tight">GovPortal India</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empowering citizens, entrepreneurs, and contractors to easily discover and access authentic government careers, procurement tenders, and innovation funding across all 28 Indian States and Union Territories.
            </p>
          </div>

          {/* Column 2: Portals */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Discover Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-white hover:underline transition-all">
                  Government Jobs (UPSC, SSC, State PSC)
                </Link>
              </li>
              <li>
                <Link href="/tenders" className="hover:text-white hover:underline transition-all">
                  Government Tenders (eProcurement)
                </Link>
              </li>
              <li>
                <Link href="/funding" className="hover:text-white hover:underline transition-all">
                  Government Funding (Grants, Subsidies)
                </Link>
              </li>
              <li>
                <Link href="/central" className="hover:text-white hover:underline transition-all">
                  Central Government Directories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: National Portals */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              National Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white hover:underline transition-all"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.startupindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white hover:underline transition-all"
                >
                  <span>Startup India Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://etenders.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white hover:underline transition-all"
                >
                  <span>Central eProcurement Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white hover:underline transition-all"
                >
                  <span>National Career Service</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & SEO */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              System Info
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>SEO Index Status: Active</li>
              <li>Sitemap: Available</li>
              <li>Version: Phase 1 (Production Ready)</li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white hover:underline text-blue-400">
                  View XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            &copy; {currentYear} GovPortal India. Prepared for authentic, easy information discovery.
          </span>
          <span className="flex items-center gap-1">
            Built for maximum speed, accessibility, and SEO optimization.
          </span>
        </div>
      </div>
    </footer>
  );
}