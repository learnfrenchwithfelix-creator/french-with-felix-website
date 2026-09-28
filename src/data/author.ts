import { siteUrl, social } from '../config/site';

export const author = {
  name: "Félix",
  jobTitle: "French teacher & founder of Liminal French",
  description:
    "Native French teacher and founder of Liminal French, a platform helping English speakers bridge the gap between classroom French and comprehensible-input immersion.",
  url: `${siteUrl}/about/`,
  image: "", // TODO: real photo path once available, e.g. "/images/felix.jpg"
  // Profiles from src/config/site.ts (empty ones left out)
  sameAs: [social.youtube, social.instagram, social.tiktok, social.spotify, social.applePodcasts].filter(Boolean),
  knowsLanguage: ["fr", "en", "ja", "pt"],
  worksFor: {
    "@type": "Organization",
    name: "Liminal French",
    url: siteUrl,
  },
};
