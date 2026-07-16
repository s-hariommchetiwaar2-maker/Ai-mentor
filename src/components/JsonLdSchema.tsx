import React from "react";

export type SchemaType = "JobPosting" | "GovernmentService" | "Organization";

interface JsonLdSchemaProps {
  type: SchemaType;
  data: Record<string, any>;
}

export default function JsonLdSchema({ type, data }: JsonLdSchemaProps) {
  const schemaMap: Record<SchemaType, Record<string, any>> = {
    Organization: {
      "@context": "https://schema.org",
      "@type": "GovernmentOrganization",
      "name": "GovPortal India",
      "url": "https://govjobs-tenders-funding.vercel.app",
      "logo": "https://govjobs-tenders-funding.vercel.app/logo.png",
      "sameAs": [
        "https://www.india.gov.in"
      ],
      "description": "An independent informational gateway to explore official Indian government careers, public works e-tenders, and startup funding programs.",
      ...data,
    },
    GovernmentService: {
      "@context": "https://schema.org",
      "@type": "GovernmentService",
      "serviceOperator": {
        "@type": "GovernmentOrganization",
        "name": "Government of India",
      },
      ...data,
    },
    JobPosting: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      ...data,
    },
  };

  const schemaJson = schemaMap[type];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
    />
  );
}