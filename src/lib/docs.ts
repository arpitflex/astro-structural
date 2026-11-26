import { getCollection, type CollectionEntry } from 'astro:content';

export type Doc = CollectionEntry<'docs'>;
export type DocKind = Doc['data']['kind'];
export type TimelineEvent = NonNullable<Doc['data']['timeline']>[number];

export const KINDS: Record<DocKind, { one: string; many: string }> = {
  pm: { one: 'post-mortem', many: 'post-mortems' },
  adr: { one: 'decision', many: 'decisions' },
  note: { one: 'note', many: 'notes' }
};

/** Every doc, newest first. */
export async function getDocs(): Promise<Doc[]> {
  const docs = await getCollection('docs');
  return docs.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function docHref(doc: Doc): string {
  return `/docs/${doc.id}`;
}

/** Reading time at 180 words a minute, counting the prose of the raw MDX body and not its imports or component tags. */
export function readingTime(body = ''): string {
  const prose = body.replace(/^import .*$/gm, '').replace(/<[^>]+>/g, '');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min`;
}
