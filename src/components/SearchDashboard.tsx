"use client";

import React, { useState, useMemo } from "react";
import { statesAndUTs, StateOrUT } from "../data/states";
import { Search, MapPin, ExternalLink, Briefcase, FileText, Gift, Landmark, Filter, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SearchDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "state" | "ut">("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "capital">("name");

  // Get all unique sectors
  const allSectors = useMemo(() => {
    const sectors = new Set<string>();
    statesAndUTs.forEach((item) => {
      item.keySectors.forEach((sec) => sectors.add(sec));
    });
    return Array.from(sectors).sort();
  }, []);

  // Filter & Sort States/UTs
  const filteredAndSortedStates = useMemo(() => {
    return statesAndUTs
      .filter((item) => {
        // Search query filter
        const matchesQuery =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.keySectors.some((sec) => sec.toLowerCase().includes(searchQuery.toLowerCase()));

        // Type filter
        const matchesType =
          selectedType === "all" ||
          (selectedType === "state" && !item.isUT) ||
          (selectedType === "ut" && item.isUT);

        // Sector filter
        const matchesSector =
          selectedSector === "all" || item.keySectors.includes(selectedSector);

        return matchesQuery && matchesType && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else {
          return a.capital.localeCompare(b.capital);
        }
      });
  }, [searchQuery, selectedType, selectedSector, sortBy]);

  return (
    <div id="search-section" className="scroll-mt-20">
      {/* Interactive Controls Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-900" />
          <span>Interactive Discovery Engine</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by state, capital, key sectors (e.g. IT, Agriculture)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-all shadow-sm"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm text-gray-700 bg-white shadow-sm transition-all"
            >
              <option value="all">All Regions (States & UTs)</option>
              <option value="state">States Only</option>
              <option value="ut">Union Territories Only</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm text-gray-700 bg-white shadow-sm transition-all"
            >
              <option value="all">All Key Sectors</option>
              {allSectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center justify-between border-t border-gray-100 mt-6 pt-4 gap-4">
          <div className="text-xs text-gray-500 font-medium">
            Showing {filteredAndSortedStates.length} out of {statesAndUTs.length} government regions
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-gray-500 font-medium">Sort By:</span>
            <button
              onClick={() => setSortBy("name")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                sortBy === "name"
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              State Name
            </button>
            <button
              onClick={() => setSortBy("capital")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                sortBy === "capital"
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Capital
            </button>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedStates.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                      {item.name}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.isUT
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {item.isUT ? "UT" : "State"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Capital: <strong className="text-gray-700">{item.capital}</strong>
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Sectors */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.keySectors.map((sec) => (
                  <span
                    key={sec}
                    className="text-[10px] bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Official Link Grid */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Official Directory Links
              </span>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={item.recruitmentWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 text-xs font-semibold rounded-lg transition-colors border border-blue-100/50"
                >
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-blue-900" />
                    <span>PSC Careers</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-blue-800" />
                </a>

                <a
                  href={item.tenderWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold rounded-lg transition-colors border border-emerald-100/50"
                >
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-800" />
                    <span>eTenders</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-emerald-800" />
                </a>

                <a
                  href={item.fundingWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-1.5 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 text-xs font-semibold rounded-lg transition-colors border border-amber-100/50"
                >
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3 text-amber-700" />
                    <span>Funding</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-amber-700" />
                </a>

                <Link
                  href={`/state/${item.id}`}
                  className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors border border-gray-200"
                >
                  <span className="flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-gray-600" />
                    <span>View Portal</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-600" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedStates.length === 0 && (
          <div className="col-span-full bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 text-center text-gray-500">
            <p className="text-sm font-semibold mb-1">No matching regions found.</p>
            <p className="text-xs text-gray-400">Try modifying your search query or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}