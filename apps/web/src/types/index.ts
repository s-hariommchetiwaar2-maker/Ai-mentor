export type PageView = 'home' | 'jobs' | 'tenders' | 'funding' | 'contact';

export type UserPlan = 'free' | 'premium';

export interface JobListing {
  id: string;
  title: string;
  agency: string;
  department: string;
  ministry: string;
  location: string;
  country: string; // Country filter
  state: string; // State-based filtering
  salaryRange: string;
  salaryNumeric: number; // For sorting by salary
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Apprenticeship';
  category: 'Central' | 'State' | 'Railway' | 'Banking' | 'Defence' | 'Police' | 'Teaching' | 'PSU' | 'Judiciary' | 'Healthcare' | 'Engineering' | 'Apprenticeship';
  status: 'Active' | 'Closed' | 'Draft'; // Status field
  deadline: string;
  publishedDate: string;
  description: string;
  requirements: string[];
  eligibility: string; // Eligibility criteria text
  officialWebsite: string; // URL link
  requiredDocuments: string[]; // Required filings list
  selectionProcess: string; // Evaluation path text
  importantInstructions: string; // Core warning notes
  officialSource: string; // Gazette/Authority origin name
}

export interface TenderListing {
  id: string;
  title: string;
  authority: string;
  department: string;
  ministry: string;
  referenceNumber: string;
  value: string;
  valueNumeric: number; // For sorting by budget
  deadline: string;
  publishedDate: string;
  location: string;
  country: string;
  state: string;
  industry: 'Infrastructure' | 'Roads & Highways' | 'Airports & Aviation' | 'Railways & Metro' | 'Power & Energy' | 'Water Resources' | 'Healthcare' | 'Education' | 'IT & Digital' | 'Government Buildings' | 'Defence' | 'Agriculture' | 'Urban Development' | 'Ports & Shipping' | 'Mining & Oil' | 'International Tenders';
  status: 'Open' | 'Under Evaluation' | 'Awarded' | 'Closed';
  description: string;
  eligibility: string; // Minimum bidder qualification
  officialWebsite: string; // Tender portal URL
  requiredDocuments: string[]; // Bid submission paperwork
  selectionProcess: string; // L1/T1 appraisal path
  importantInstructions: string; // Guarantee/warning indices
  officialSource: string; // E-Procurement notice origin name
}

export interface FundingScheme {
  id: string;
  title: string;
  ministry: string;
  department: string;
  amount: string;
  amountNumeric: number; // For sorting by grant size
  eligibility: string;
  country: string;
  state: string;
  sector: 'Startup' | 'MSME' | 'Agriculture' | 'Women' | 'Students' | 'Research' | 'Export' | 'Manufacturing' | 'Innovation';
  status: 'Active' | 'Suspended' | 'Closed';
  deadline: string;
  publishedDate: string;
  description: string;
  benefits: string[];
  officialWebsite: string; // Scheme details portal URL
  requiredDocuments: string[]; // Appraisal documents list
  selectionProcess: string; // Incubation validation cycle
  importantInstructions: string; // Milestones/compliance indices
  officialSource: string; // Central Scheme gazette name
}

export interface ContactInquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}
