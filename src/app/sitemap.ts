import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://claremesh.com";
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/schema`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/loyalty`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/compare/plaid`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/merge`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/in-house`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/airbyte`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/fivetran`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/lp/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
      { url: 'https://claremesh.com/security/trust-center', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://claremesh.com/security/controls', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://claremesh.com/security/sub-processors', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://claremesh.com/security/vulnerability-disclosure', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

  ];
}
