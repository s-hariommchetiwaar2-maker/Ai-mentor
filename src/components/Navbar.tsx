"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Landmark, Briefcase, FileText, Gift, HelpCircle } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top National Banner */}
      <div className="bg-gradient-to-r from-gov-orange via-white to-gov-green px-4 py-1 text-center text-xs font-semibold text-gray-800 border-b border-gray-100 flex items-center justify-center gap-2">
        <Landmark className="w-3 h-3 text-gov-navy" />
        <span>Official Phase 1 Platform — Dedicated to Authentic Indian Government Portals</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-blue-900 text-white p-2 rounded-lg group-hover:bg-blue-800 transition-colors">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-gray-900 block tracking-tight leading-none">
                  GovPortal <span className="text-blue-900">India</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase block mt-1">
                  Jobs, Tenders & Funding
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <Briefcase className="w-4 h-4 text-blue-900" />
              <span>Government Jobs</span>
            </Link>
            <Link
              href="/tenders"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Government Tenders</span>
            </Link>
            <Link
              href="/funding"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <Gift className="w-4 h-4 text-amber-600" />
              <span>Government Funding</span>
            </Link>
            <Link
              href="/central"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <Landmark className="w-4 h-4 text-indigo-700" />
              <span>Central Government</span>
            </Link>
          </div>

          {/* Right utility & mobile menu button */}
          <div className="flex items-center space-x-3">
            <Link
              href="/#search-section"
              className="p-2 text-gray-500 hover:text-blue-900 hover:bg-gray-100 rounded-lg transition-all"
              title="Search Portals"
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-900 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-inner animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              href="/jobs"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Briefcase className="w-5 h-5 text-blue-900" />
              <span>Government Jobs</span>
            </Link>
            <Link
              href="/tenders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            >
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Government Tenders</span>
            </Link>
            <Link
              href="/funding"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Gift className="w-5 h-5 text-amber-600" />
              <span>Government Funding</span>
            </Link>
            <Link
              href="/central"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Landmark className="w-5 h-5 text-indigo-700" />
              <span>Central Government Portal</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}