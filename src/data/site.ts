export interface SocialLink {
  /** Lowercase label shown in the footer and /about links list (e.g. 'github', 'linkedin', 'x'). */
  label: string;
  /** Display handle or path shown in the /about elsewhere table (e.g. 'your-handle', 'in/your-handle'). */
  value: string;
  /** Full URL to the profile. */
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  lang: string;
  /** Lowercase name used in the home hero, subpage meta bar, page titles, and RSS feed. */
  name: string;
  /** Title-case name used in <meta name="author"> and schema.org Person metadata. */
  fullName: string;
  /** Lowercase role shown in the home page meta bar and home <title>. */
  role: string;
  /** Optional title-case role for schema.org Person.jobTitle. Leave empty to omit. */
  jobTitle?: string;
  /** Optional organization name for schema.org Person.worksFor. Leave empty to omit. */
  company?: string;
  tagline: string;
  description: string;
  /** Optional contact email; set to '' or omit to hide from footer and /about. */
  email?: string;
  /** Optional GitHub usernames queried at build time (requires GITHUB_TOKEN) for the home commit field. */
  githubUsers: readonly string[];
  /** Show a deterministic sample commit field when githubUsers is empty. Omit or set to false to hide. */
  sampleCommits?: boolean;
  /** Social profiles rendered in the footer, /about elsewhere list, and schema.org sameAs. */
  socials: readonly SocialLink[];
  nav: readonly NavItem[];
}

/** The docs in one line: used as the description of /docs and the second sentence of the site's. */
const tagline = 'Post-mortems, decision records and technical notes on a twelve-column grid.';

export const SITE: SiteConfig = {
  lang: 'en',
  name: 'your name',
  fullName: 'Your Name',
  role: 'software engineer · systems',
  jobTitle: 'Software Engineer',
  company: 'Acme Systems',
  tagline,
  description: `Personal website of Your Name, software engineer. ${tagline}`,
  email: 'hello@example.com',
  githubUsers: [],
  sampleCommits: true,
  socials: [
    { label: 'github', value: 'your-handle', url: 'https://github.com/your-handle' },
    { label: 'linkedin', value: 'in/your-handle', url: 'https://linkedin.com/in/your-handle' }
  ],
  nav: [
    { label: 'about', href: '/about' },
    { label: 'docs', href: '/docs' },
    { label: 'trace', href: '/trace' }
  ]
};
