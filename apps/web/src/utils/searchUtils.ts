import { JobListing, TenderListing, FundingScheme } from '../types/index.js';

export type SortOption = 'none' | 'deadline-asc' | 'deadline-desc' | 'budget-desc' | 'budget-asc' | 'title-asc';

/**
 * Filter job listings dynamically based on multiple advanced facets.
 */
export function filterJobs(
  jobs: JobListing[],
  query: string,
  selectedCategory: string,
  selectedState: string,
  selectedCountry: string,
  selectedStatus: string
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
    const matchesCountry = selectedCountry === 'All Countries' || j.country === selectedCountry;
    const matchesStatus = selectedStatus === 'All' || j.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesState && matchesCountry && matchesStatus;
  });
}

/**
 * Sort job listings by chosen advanced options.
 */
export function sortJobs(jobs: JobListing[], option: SortOption): JobListing[] {
  const sorted = [...jobs];
  if (option === 'deadline-asc') {
    sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (option === 'deadline-desc') {
    sorted.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  } else if (option === 'budget-desc') {
    sorted.sort((a, b) => b.salaryNumeric - a.salaryNumeric);
  } else if (option === 'budget-asc') {
    sorted.sort((a, b) => a.salaryNumeric - b.salaryNumeric);
  } else if (option === 'title-asc') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return sorted;
}

/**
 * Filter tender listings dynamically based on advanced facets.
 */
export function filterTenders(
  tenders: TenderListing[],
  query: string,
  selectedIndustry: string,
  selectedState: string,
  selectedCountry: string,
  selectedStatus: string
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
    const matchesCountry = selectedCountry === 'All Countries' || t.country === selectedCountry;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

    return matchesSearch && matchesIndustry && matchesState && matchesCountry && matchesStatus;
  });
}

/**
 * Sort tender listings by choosing options.
 */
export function sortTenders(tenders: TenderListing[], option: SortOption): TenderListing[] {
  const sorted = [...tenders];
  if (option === 'deadline-asc') {
    sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (option === 'deadline-desc') {
    sorted.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  } else if (option === 'budget-desc') {
    sorted.sort((a, b) => b.valueNumeric - a.valueNumeric);
  } else if (option === 'budget-asc') {
    sorted.sort((a, b) => a.valueNumeric - b.valueNumeric);
  } else if (option === 'title-asc') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return sorted;
}

/**
 * Filter funding schemes dynamically based on advanced facets.
 */
export function filterFunding(
  schemes: FundingScheme[],
  query: string,
  selectedSector: string,
  selectedState: string,
  selectedCountry: string,
  selectedStatus: string
): FundingScheme[] {
  const normQuery = query.toLowerCase();
  return schemes.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(normQuery) ||
      f.ministry.toLowerCase().includes(normQuery) ||
      f.description.toLowerCase().includes(normQuery);

    const matchesSector = selectedSector === 'All' || f.sector === selectedSector;
    const matchesState = selectedState === 'All States' || f.state === selectedState || f.state === 'National';
    const matchesCountry = selectedCountry === 'All Countries' || f.country === selectedCountry;
    const matchesStatus = selectedStatus === 'All' || f.status === selectedStatus;

    return matchesSearch && matchesSector && matchesState && matchesCountry && matchesStatus;
  });
}

/**
 * Sort funding schemes by chooses.
 */
export function sortFunding(schemes: FundingScheme[], option: SortOption): FundingScheme[] {
  const sorted = [...schemes];
  if (option === 'deadline-asc') {
    sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (option === 'deadline-desc') {
    sorted.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  } else if (option === 'budget-desc') {
    sorted.sort((a, b) => b.amountNumeric - a.amountNumeric);
  } else if (option === 'budget-asc') {
    sorted.sort((a, b) => a.amountNumeric - b.amountNumeric);
  } else if (option === 'title-asc') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return sorted;
}

/**
 * Perform global index match queries from Home view.
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
  sortJobs,
  filterTenders,
  sortTenders,
  filterFunding,
  sortFunding,
  determineGlobalSearchTarget
};
