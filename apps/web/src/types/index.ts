export type PageView = 'home' | 'jobs' | 'tenders' | 'funding' | 'contact';

export interface JobListing {
  id: string;
  title: string;
  agency: string;
  department: string;
  location: string;
  state: string;
  salaryRange: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Apprenticeship';
  category: 'Central' | 'State' | 'Railway' | 'Banking' | 'Defence' | 'Police' | 'Teaching' | 'PSU' | 'Judiciary' | 'Healthcare' | 'Engineering' | 'Apprenticeship';
  deadline: string;
  description: string;
  requirements: string[];
}

export interface TenderListing {
  id: string;
  title: string;
  authority: string;
  department: string;
  referenceNumber: string;
  value: string;
  deadline: string;
  publishedDate: string;
  location: string;
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
  eligibility: string;
  state: string;
  sector: 'Startup' | 'MSME' | 'Agriculture' | 'Women' | 'Students' | 'Research' | 'Export' | 'Manufacturing' | 'Innovation';
  description: string;
  benefits: string[];
}

export interface ContactInquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}
