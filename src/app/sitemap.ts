import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://govjobs-tenders-funding.vercel.app";

  const staticPages = [
    "",
    "/central",
    "/jobs",
    "/tenders",
    "/funding",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const states = [
    "andhra-pradesh",
    "arunachal-pradesh",
    "assam",
    "bihar",
    "chhattisgarh",
    "goa",
    "gujarat",
    "haryana",
    "himachal-pradesh",
    "jharkhand",
    "karnataka",
    "kerala",
    "madhya-pradesh",
    "maharashtra",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "odisha",
    "punjab",
    "rajasthan",
    "sikkim",
    "tamil-nadu",
    "telangana",
    "tripura",
    "uttar-pradesh",
    "uttarakhand",
    "west-bengal",
    "delhi",
    "jammu-and-kashmir",
    "puducherry",
  ];

  const statePages = states.map((state) => ({
    url: `${baseUrl}/state/${state}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...statePages];
}