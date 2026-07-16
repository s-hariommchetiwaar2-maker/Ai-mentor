export interface StateOrUT {
  id: string;
  name: string;
  capital: string;
  isUT: boolean;
  officialWebsite: string;
  recruitmentWebsite: string;
  tenderWebsite: string;
  fundingWebsite: string;
  description: string;
  keySectors: string[];
}

export const statesAndUTs: StateOrUT[] = [
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    capital: "Amaravati",
    isUT: false,
    officialWebsite: "https://www.ap.gov.in",
    recruitmentWebsite: "https://psc.ap.gov.in",
    tenderWebsite: "https://apeprocurement.gov.in",
    fundingWebsite: "https://www.apindg.gov.in",
    description: "Access latest public service commission updates, tenders and industry development programs from Andhra Pradesh Government.",
    keySectors: ["Agriculture", "Information Technology", "Pharmaceuticals", "Textiles"]
  },
  {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    isUT: false,
    officialWebsite: "https://arunachalpradesh.gov.in",
    recruitmentWebsite: "https://appsc.gov.in",
    tenderWebsite: "https://arunachaltenders.gov.in",
    fundingWebsite: "https://arunachalpradesh.gov.in/industry-and-investment/",
    description: "Explore northeast development opportunities, infrastructure tenders, and public service careers in Arunachal Pradesh.",
    keySectors: ["Hydropower", "Horticulture", "Tourism", "Handlooms"]
  },
  {
    id: "assam",
    name: "Assam",
    capital: "Dispur",
    isUT: false,
    officialWebsite: "https://assam.gov.in",
    recruitmentWebsite: "https://apsc.nic.in",
    tenderWebsite: "https://assamtenders.gov.in",
    fundingWebsite: "https://industries.assam.gov.in",
    description: "Discover public job postings, tea-estate and industrial tenders, and skill development funding programs in Assam.",
    keySectors: ["Tea", "Petroleum & Gas", "Tourism", "Agriculture & Forestry"]
  },
  {
    id: "bihar",
    name: "Bihar",
    capital: "Patna",
    isUT: false,
    officialWebsite: "https://state.bihar.gov.in",
    recruitmentWebsite: "https://bpsc.bih..nic.in",
    tenderWebsite: "https://eproc2.bihar.gov.in",
    fundingWebsite: "https://state.bihar.gov.in/industries",
    description: "Latest BPSC recruitment notices, state civil works contracts, and state-backed business credit schemes in Bihar.",
    keySectors: ["Agriculture", "Food Processing", "Renewable Energy", "Handicrafts"]
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    capital: "Raipur",
    isUT: false,
    officialWebsite: "https://cgstate.gov.in",
    recruitmentWebsite: "https://psc.cg.gov.in",
    tenderWebsite: "https://eproc.cgstate.gov.in",
    fundingWebsite: "https://industries.cg.gov.in",
    description: "Find mineral and industrial sector tenders, Chhattisgarh PSC notices, and MSME subsidy policies.",
    keySectors: ["Mining & Metallurgy", "Power generation", "Forest Products", "Cement"]
  },
  {
    id: "goa",
    name: "Goa",
    capital: "Panaji",
    isUT: false,
    officialWebsite: "https://www.goa.gov.in",
    recruitmentWebsite: "https://gpsc.goa.gov.in",
    tenderWebsite: "https://goatenders.gov.in",
    fundingWebsite: "https://www.ditc.goa.gov.in",
    description: "Explore beach tourism-related tenders, administrative vacancies, and start-up incentives in Goa.",
    keySectors: ["Tourism", "Pharmaceuticals", "Fisheries", "Information Technology"]
  },
  {
    id: "gujarat",
    name: "Gujarat",
    capital: "Gandhinagar",
    isUT: false,
    officialWebsite: "https://gujaratindia.gov.in",
    recruitmentWebsite: "https://gpsc.gujarat.gov.in",
    tenderWebsite: "https://www.nprocure.com",
    fundingWebsite: "https://ic.gujarat.gov.in",
    description: "Get notifications for Gujarat PSC, massive manufacturing and maritime tenders, and start-up financial subsidies.",
    keySectors: ["Chemicals & Petrochemicals", "Textiles", "Diamonds & Jewelry", "Renewable Energy"]
  },
  {
    id: "haryana",
    name: "Haryana",
    capital: "Chandigarh",
    isUT: false,
    officialWebsite: "https://www.haryana.gov.in",
    recruitmentWebsite: "https://hpsc.gov.in",
    tenderWebsite: "https://etenders.hry.nic.in",
    fundingWebsite: "https://investharyana.in",
    description: "Access HPSC public exam notifications, urban development tenders, and automotive sector incentives in Haryana.",
    keySectors: ["Automotive", "Information Technology", "Agriculture", "Real Estate"]
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    capital: "Shimla",
    isUT: false,
    officialWebsite: "https://himachal.nic.in",
    recruitmentWebsite: "https://www.hppsc.hp.gov.in",
    tenderWebsite: "https://hptenders.gov.in",
    fundingWebsite: "https://himachal.nic.in/index1.php?lang=1&dpt_id=11",
    description: "Discover clean hydro-electric energy tenders, agro-horticulture jobs, and hospitality business funding in Himachal.",
    keySectors: ["Horticulture", "Hydro-power", "Tourism", "Pharmaceuticals"]
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    capital: "Ranchi",
    isUT: false,
    officialWebsite: "https://www.jharkhand.gov.in",
    recruitmentWebsite: "https://www.jpsc.gov.in",
    tenderWebsite: "https://jharkhandtenders.gov.in",
    fundingWebsite: "https://jharkhandindustries.nic.in",
    description: "Get mining and heavy industry tenders, JPSC employment news, and tribal enterprise grants in Jharkhand.",
    keySectors: ["Steel", "Coal & Minerals", "Heavy Engineering", "Forestry"]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    capital: "Bengaluru",
    isUT: false,
    officialWebsite: "https://www.karnataka.gov.in",
    recruitmentWebsite: "https://kpsc.kar.nic.in",
    tenderWebsite: "https://eproc.karnataka.gov.in",
    fundingWebsite: "https://startup.karnataka.gov.in",
    description: "Access tech capital public jobs, Smart City e-procurements, and start-up/R&D seed funding updates in Karnataka.",
    keySectors: ["IT & Electronics", "Aerospace & Defense", "Biotechnology", "Agriculture"]
  },
  {
    id: "kerala",
    name: "Kerala",
    capital: "Thiruvananthapuram",
    isUT: false,
    officialWebsite: "https://kerala.gov.in",
    recruitmentWebsite: "https://www.keralapsc.gov.in",
    tenderWebsite: "https://etenders.kerala.gov.in",
    fundingWebsite: "https://keralastartupmission.com",
    description: "Explore tourism, wellness, and high-literacy government careers, public works tenders, and Kerala Startup Mission schemes.",
    keySectors: ["Tourism", "Agro-processing", "Information Technology", "Healthcare"]
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    capital: "Bhopal",
    isUT: false,
    officialWebsite: "https://mp.gov.in",
    recruitmentWebsite: "https://mppsc.mp.gov.in",
    tenderWebsite: "https://mptenders.gov.in",
    fundingWebsite: "https://www.mpindustry.gov.in",
    description: "Get central Indian infrastructure tenders, MPPSC exam calendars, and agricultural food processing subsidies.",
    keySectors: ["Forestry", "Automobiles", "Textiles", "Tourism"]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    capital: "Mumbai",
    isUT: false,
    officialWebsite: "https://www.maharashtra.gov.in",
    recruitmentWebsite: "https://mpsc.gov.in",
    tenderWebsite: "https://mahatenders.gov.in",
    fundingWebsite: "https://www.maharashtrasanyojak.in",
    description: "Track massive infrastructure bids, Maharashtra State Government gazetted career openings, and financial scheme applications.",
    keySectors: ["Financial Services", "Automobiles", "Real Estate", "Entertainment"]
  },
  {
    id: "manipur",
    name: "Manipur",
    capital: "Imphal",
    isUT: false,
    officialWebsite: "https://manipur.gov.in",
    recruitmentWebsite: "https://mpscmanipur.gov.in",
    tenderWebsite: "https://manipurtenders.gov.in",
    fundingWebsite: "https://manipur.gov.in/industries-and-commerce/",
    description: "Explore administrative jobs, handicraft and agriculture-related tenders, and traditional handloom funding options.",
    keySectors: ["Handicrafts & Handlooms", "Agriculture", "Food Processing", "Ecotourism"]
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    capital: "Shillong",
    isUT: false,
    officialWebsite: "https://meghalaya.gov.in",
    recruitmentWebsite: "https://mpsc.nic.in",
    tenderWebsite: "https://meghalayatenders.gov.in",
    fundingWebsite: "https://megindustry.gov.in",
    description: "Discover public job applications, ecological tourism projects, and rural community development grants in Meghalaya.",
    keySectors: ["Tourism", "Minerals & Mining", "Horticulture", "Handicrafts"]
  },
  {
    id: "mizoram",
    name: "Mizoram",
    capital: "Aizawl",
    isUT: false,
    officialWebsite: "https://mizoram.gov.in",
    recruitmentWebsite: "https://mpsc.mizoram.gov.in",
    tenderWebsite: "https://mizoramtenders.gov.in",
    fundingWebsite: "https://industries.mizoram.gov.in",
    description: "Access bamboo processing industry tenders, Mizoram PSC notifications, and border trade development funds.",
    keySectors: ["Bamboo processing", "Agriculture", "Tourism", "Sericulture"]
  },
  {
    id: "nagaland",
    name: "Nagaland",
    capital: "Kohima",
    isUT: false,
    officialWebsite: "https://nagaland.gov.in",
    recruitmentWebsite: "https://npsc.co.in",
    tenderWebsite: "https://nagalandtenders.gov.in",
    fundingWebsite: "https://industry.nagaland.gov.in",
    description: "Explore northeast agro-businesses, Nagaland state PSC updates, and hill-area infrastructure procurement details.",
    keySectors: ["Forest Products", "Horticulture", "Mineral reserves", "Tourism"]
  },
  {
    id: "odisha",
    name: "Odisha",
    capital: "Bhubaneswar",
    isUT: false,
    officialWebsite: "https://odisha.gov.in",
    recruitmentWebsite: "https://opsc.gov.in",
    tenderWebsite: "https://tendersodisha.gov.in",
    fundingWebsite: "https://startupodisha.gov.in",
    description: "Find mega mineral extraction tenders, Odisha PSC recruitment events, and Startup Odisha ecosystem funding.",
    keySectors: ["Metallurgy & Mining", "IT & ESDM", "Sea Food Processing", "Chemicals"]
  },
  {
    id: "punjab",
    name: "Punjab",
    capital: "Chandigarh",
    isUT: false,
    officialWebsite: "https://punjab.gov.in",
    recruitmentWebsite: "https://ppsc.gov.in",
    tenderWebsite: "https://eproc.punjab.gov.in",
    fundingWebsite: "https://pbi.gov.in",
    description: "Track grain production machinery bids, Punjab Public Service Commission jobs, and Invest Punjab industrial credits.",
    keySectors: ["Agriculture", "Textiles", "Bicycles & Auto Parts", "Food Processing"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    capital: "Jaipur",
    isUT: false,
    officialWebsite: "https://rajasthan.gov.in",
    recruitmentWebsite: "https://rpsc.rajasthan.gov.in",
    tenderWebsite: "https://eproc.rajasthan.gov.in",
    fundingWebsite: "https://industries.rajasthan.gov.in",
    description: "Check RPSC civil exams, solar energy and heritage tourism procurement projects, and MSME subsidy programs in Rajasthan.",
    keySectors: ["Solar Power", "Tourism & Heritage", "Gemstones", "Agriculture"]
  },
  {
    id: "sikkim",
    name: "Sikkim",
    capital: "Gangtok",
    isUT: false,
    officialWebsite: "https://sikkim.gov.in",
    recruitmentWebsite: "https://spsc.sikkim.gov.in",
    tenderWebsite: "https://sikkimtenders.gov.in",
    fundingWebsite: "https://sikkim.gov.in/departments/commerce-industries-department",
    description: "Explore 100% organic farming initiatives, Sikkim PSC vacancies, and environment-friendly business microloans.",
    keySectors: ["Organic Farming", "Eco-tourism", "Breweries & Beverages", "Hydro-energy"]
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    capital: "Chennai",
    isUT: false,
    officialWebsite: "https://www.tn.gov.in",
    recruitmentWebsite: "https://www.tnpsc.gov.in",
    tenderWebsite: "https://tntenders.gov.in",
    fundingWebsite: "https://www.startuptn.in",
    description: "Find updates on TNPSC government careers, automobile hub supply tenders, and StartupTN seed fund policies.",
    keySectors: ["Automobiles", "Electronics", "Textiles & Garments", "Leather Processing"]
  },
  {
    id: "telangana",
    name: "Telangana",
    capital: "Hyderabad",
    isUT: false,
    officialWebsite: "https://www.telangana.gov.in",
    recruitmentWebsite: "https://www.tspsc.gov.in",
    tenderWebsite: "https://tender.telangana.gov.in",
    fundingWebsite: "https://startup.telangana.gov.in",
    description: "Get TSPSC careers, pharma city engineering project tenders, and T-Hub start-up grant programs.",
    keySectors: ["Information Technology", "Pharmaceuticals", "Aerospace", "Agriculture"]
  },
  {
    id: "tripura",
    name: "Tripura",
    capital: "Agartala",
    isUT: false,
    officialWebsite: "https://tripura.gov.in",
    recruitmentWebsite: "https://tpsc.tripura.gov.in",
    tenderWebsite: "https://tripuratenders.gov.in",
    fundingWebsite: "https://industries.tripura.gov.in",
    description: "Explore rubber plantation industrial tenders, TPSC recruitment portals, and cross-border trade enterprise support.",
    keySectors: ["Rubber plantations", "Food Processing", "Horticulture", "Handicrafts"]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    capital: "Lucknow",
    isUT: false,
    officialWebsite: "https://up.gov.in",
    recruitmentWebsite: "https://uppsc.up.nic.in",
    tenderWebsite: "https://etender.up.nic.in",
    fundingWebsite: "https://upstartup.in",
    description: "Find UPPSC notifications, expressway construction tenders, and ODOP (One District One Product) microenterprise capital.",
    keySectors: ["Handlooms", "Leather", "Information Technology", "Agriculture"]
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    capital: "Dehradun",
    isUT: false,
    officialWebsite: "https://uk.gov.in",
    recruitmentWebsite: "https://psc.uk.gov.in",
    tenderWebsite: "https://uktenders.gov.in",
    fundingWebsite: "https://doiuk.org",
    description: "Get Himalayan wellness and tourism development tenders, UKPSC jobs calendars, and state industrial investment subsidies.",
    keySectors: ["Eco-tourism", "Hydro-power", "Horticulture", "Ayurveda & Yoga"]
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    capital: "Kolkata",
    isUT: false,
    officialWebsite: "https://wb.gov.in",
    recruitmentWebsite: "https://wbpsc.gov.in",
    tenderWebsite: "https://wbtenders.gov.in",
    fundingWebsite: "https://wbiidc.wb.gov.in",
    description: "Access WBPSC updates, MSME textile cluster procurement contracts, and leather estate enterprise grants in West Bengal.",
    keySectors: ["Steel & Minerals", "Agriculture", "Information Technology", "Leather Goods"]
  },
  // Key Union Territories
  {
    id: "delhi",
    name: "Delhi",
    capital: "New Delhi",
    isUT: true,
    officialWebsite: "https://delhi.gov.in",
    recruitmentWebsite: "https://dsssb.delhi.gov.in",
    tenderWebsite: "https://govtprocurement.delhi.gov.in",
    fundingWebsite: "https://delhipolice.gov.in", // Placeholder or direct industrial development
    description: "Access National Capital Territory DSSSB teacher/administrative recruitment, municipal tenders, and start-up incentives.",
    keySectors: ["Services Sector", "IT & Telecom", "Retail & Commerce", "Tourism"]
  },
  {
    id: "jammu-and-kashmir",
    name: "Jammu and Kashmir",
    capital: "Srinagar/Jammu",
    isUT: true,
    officialWebsite: "https://jk.gov.in",
    recruitmentWebsite: "https://jkpsc.nic.in",
    tenderWebsite: "https://jktenders.gov.in",
    fundingWebsite: "https://jkindustriescommerce.nic.in",
    description: "Get Kashmir horticulture and handicraft tenders, JKPSC administrative services information, and tourism development support.",
    keySectors: ["Horticulture", "Handicrafts & Carpets", "Tourism", "Sericulture"]
  },
  {
    id: "puducherry",
    name: "Puducherry",
    capital: "Pondicherry",
    isUT: true,
    officialWebsite: "https://py.gov.in",
    recruitmentWebsite: "https://recruitment.py.gov.in",
    tenderWebsite: "https://pudutenders.gov.in",
    fundingWebsite: "https://industries.py.gov.in",
    description: "Explore beach tourism-related tenders, administrative vacancies, and start-up incentives in Puducherry.",
    keySectors: ["Tourism", "Fisheries", "Textiles", "Chemicals"]
  }
];