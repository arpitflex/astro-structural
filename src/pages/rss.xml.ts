import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@data/site';
import { KINDS, docHref, getDocs } from '@lib/docs';

export async function GET(context: APIContext) {
  const docs = await getDocs();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? context.url,
    trailingSlash: false,
    items: docs.map((doc) => ({
      title: doc.data.title,
      description: doc.data.dek,
      pubDate: doc.data.date,
      link: docHref(doc),
      categories: [KINDS[doc.data.kind].one]
    }))
  });
}
