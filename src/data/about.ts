export interface AboutConfig {
  /** Short statement shown in the "about" section on the home page. */
  homeStatement: string;
  /** Meta description for /about. */
  description: string;
  /** Highlighted current work shown in the "now" section on /about. */
  now: string;
  /** Biographical paragraphs rendered under "before" on /about. */
  before: readonly string[];
  /** Optional colophon note rendered at the bottom of /about. */
  colophon?: string;
}

export const ABOUT: AboutConfig = {
  homeStatement:
    'I am a software engineer building distributed systems and developer tooling. Before this I worked on cloud infrastructure at Northstar Labs and studied computer science.',
  description: 'About Your Name: current work, background, links, and colophon.',
  now: 'I currently work on backend and infrastructure systems at Acme Systems, focusing on reliability, latency, and predictable operations.',
  before: [
    'I studied Computer Science at State University, focusing on operating systems, networking, and fault-tolerant storage.',
    'Earlier in my career at Northstar Labs, I built internal deployment pipelines, observability tooling, and batch processing services.'
  ],
  colophon:
    'Designed in the spirit of Wim Crouwel and Dutch structuralism, where a visible twelve-column grid decides every position and size. Set in Archivo and Martian Mono.'
};
