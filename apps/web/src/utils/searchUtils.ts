import { JobListing, TenderListing, FundingScheme } from '../types/index.js';

/**
 * Filter job listings dynamically based on query, sector category, and state selection.
 */
export function filterJobs(
  jobs: JobListing[],
  query: string,
  selectedCategory: string,
  selectedState: string
): JobListing[] {
  const normQuery = query.toLowerCase();
  return jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(normQuery) ||
      j.agency.toLowerCase().includes(normQuery) ||
      j.location.toLowerCase().includes(normQuery) ||
      j.description.toLowerCase().includes(normQuery);
    const matchesCategory = selectedCategory === 'All' || j.category === selectedCategory;
    const matchesState = selectedState === 'All States' || j.state === selectedState || j.state === 'All States';
    return matchesSearch && matchesCategory && matchesState;
  });
}

/**
 * Filter tender listings dynamically based on query, industry classification, and state selection.
 */
export function filterTenders(
  tenders: TenderListing[],
  query: string,
  selectedIndustry: string,
  selectedState: string
): TenderListing[] {
  const normQuery = query.toLowerCase();
  return tenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(normQuery) ||
      t.authority.toLowerCase().includes(normQuery) ||
      t.location.toLowerCase().includes(normQuery) ||
      t.referenceNumber.toLowerCase().includes(normQuery);
    const matchesIndustry = selectedIndustry === 'All' || t.industry === selectedIndustry;
    const matchesState = selectedState === 'All States' || t.state === selectedState;
    return matchesSearch && matchesIndustry && matchesState;
  });
}

/**
 * Filter funding schemes dynamically based on query, class sector, and state selection.
 */
export function filterFunding(
  schemes: FundingScheme[],
  query: string,
  selectedSector: string,
  selectedState: string
): FundingScheme[] {
  const normQuery = query.toLowerCase();
  return schemes.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(normQuery) ||
      f.ministry.toLowerCase().includes(normQuery) ||
      f.description.toLowerCase().includes(normQuery);
    const matchesSector = selectedSector === 'All' || f.sector === selectedSector;
    const matchesState = selectedState === 'All States' || f.state === selectedState || f.state === 'National';
    return matchesSearch && matchesSector && matchesState;
  });
}

/**
 * Perform global index match queries from Home view.
 * Analyzes keyword matches and outputs the highest probability page classification ('jobs', 'tenders', or 'funding').
 */
export function determineGlobalSearchTarget(
  query: string,
  jobs: JobListing[],
  tenders: TenderListing[],
  schemes: FundingScheme[]
): 'jobs' | 'tenders' | 'funding' {
  const normQuery = query.toLowerCase();

  const matchedJobsCount = jobs.filter(
    (j) => j.title.toLowerCase().includes(normQuery) || j.description.toLowerCase().includes(normQuery)
  ).length;

  const matchedTendersCount = tenders.filter(
    (t) => t.title.toLowerCase().includes(normQuery) || t.description.toLowerCase().includes(normQuery)
  ).length;

  const matchedFundingCount = schemes.filter(
    (f) => f.title.toLowerCase().includes(normQuery) || f.description.toLowerCase().includes(normQuery)
  ).length;

  if (matchedJobsCount >= matchedTendersCount && matchedJobsCount >= matchedFundingCount && matchedJobsCount > 0) {
    return 'jobs';
  } else if (matchedTendersCount >= matchedFundingCount && matchedTendersCount > 0) {
    return 'tenders';
  } else if (matchedFundingCount > 0) {
    return 'funding';
  }

  return 'jobs'; // Default fallback matching tab
}
export default {
  filterJobs,
  filterTenders,
  filterFunding,
  determineGlobalSearchTarget
};
