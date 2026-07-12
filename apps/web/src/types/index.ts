export type PageView = 'home' | 'jobs' | 'tenders' | 'funding' | 'contact';

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
  industry: 'Construction' | 'IT' | 'Energy' | 'Healthcare' | 'Education' | 'Railways' | 'Defence' | 'Telecom' | 'Smart Cities' | 'Agriculture';
  status: 'Open' | 'Under Evaluation' | 'Awarded' | 'Closed';
  description: string;
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
}

export interface ContactInquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}
