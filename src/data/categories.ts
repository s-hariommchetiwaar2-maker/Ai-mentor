export interface Subcategory {
  id: string;
  name: string;
  description: string;
  officialSource: string;
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "jobs",
    name: "Government Jobs",
    tagline: "Secure your future with gazetted and non-gazetted positions",
    description: "Discover official job notifications, public sector exams, state and central commissions announcements, and administrative openings directly from authorized sources.",
    subcategories: [
      {
        id: "civil-services",
        name: "Civil & Administrative Services",
        description: "IAS, IPS, IFS, state administrative officers, and ministerial staff positions.",
        officialSource: "Union Public Service Commission (UPSC) & State Public Service Commissions"
      },
      {
        id: "banking",
        name: "Banking & Financial Sector",
        description: "Probationary officers, clerks, and executive staff in public sector banks and RBI.",
        officialSource: "Institute of Banking Personnel Selection (IBPS) & State Bank of India (SBI)"
      },
      {
        id: "defense-police",
        name: "Defense, Police & Security Force",
        description: "Armed forces recruitment, state police divisions, paramilitary forces, and coast guard.",
        officialSource: "Ministry of Defence, SSC, & State Police Recruitment Boards"
      },
      {
        id: "education-railways",
        name: "Railways & Academic Institutions",
        description: "Technical staff, station masters, researchers, government university professors, and school educators.",
        officialSource: "Railway Recruitment Boards (RRB) & National Testing Agency (NTA)"
      }
    ]
  },
  {
    id: "tenders",
    name: "Government Tenders",
    tagline: "Partner with government entities for high-value contracts",
    description: "Get comprehensive access to centralized procurement portals, infrastructure projects, technology contracts, supply chain request-for-proposals (RFPs).",
    subcategories: [
      {
        id: "infrastructure",
        name: "Civil, Roads & Infrastructure",
        description: "National high-ways, smart city redevelopment, bridge constructions, and water supply pipelines.",
        officialSource: "Central Public Works Department (CPWD) & National Highways Authority of India (NHAI)"
      },
      {
        id: "it-telecom",
        name: "IT Services & Digitization",
        description: "Cloud hosting contracts, custom software developments, e-governance solutions, and hardware supplies.",
        officialSource: "National Informatics Centre (NIC) & Ministry of Electronics and IT (MeitY)"
      },
      {
        id: "defence-supply",
        name: "Defense & Heavy Engineering Supplies",
        description: "Equipment logistics, customized machinery, heavy vehicle parts, and defense-related raw materials.",
        officialSource: "Defence eProcurement Portal & Ordnance Factory Board"
      },
      {
        id: "medical",
        name: "Medical Equipment & Consumables",
        description: "Government hospital instruments supply, pharmaceutical procurement, and lab equipment installations.",
        officialSource: "Ministry of Health and Family Welfare & State Medical Corporations"
      }
    ]
  },
  {
    id: "funding",
    name: "Government Funding",
    tagline: "Empower your entrepreneurship and research with official grants",
    description: "Explore government subsidies, state-backed seed funds, incubator networks, innovation grants, and debt-assistance policies for startups and researchers.",
    subcategories: [
      {
        id: "startup-seed",
        name: "Startup India & Seed Capital",
        description: "Equity-free grants, tax exemptions, state startup missions seed funds, and incubator programs.",
        officialSource: "Department for Promotion of Industry and Internal Trade (DPIIT)"
      },
      {
        id: "msme-credit",
        name: "MSME Credit & Subsidies",
        description: "Low-interest business loans, credit guarantees, technology upgradation schemes, and textile cluster subsidies.",
        officialSource: "Ministry of Micro, Small and Medium Enterprises"
      },
      {
        id: "science-rd",
        name: "Scientific Research & R&D Grants",
        description: "PhD fellowships, laboratory research sponsorships, green technology innovation grants, and patents assistance.",
        officialSource: "Department of Science and Technology (DST) & BIRAC"
      },
      {
        id: "agriculture",
        name: "Agriculture & Agro-Industrial Subsidies",
        description: "Cold storage facility subsidies, drip irrigation equipment grants, and organic farming conversion assistance.",
        officialSource: "Ministry of Agriculture and Farmers Welfare & NABARD"
      }
    ]
  }
];