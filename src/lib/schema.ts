/** The schema.org id of the site's Person node. Layout emits the node; a doc's TechArticle names it as author. */
export function personId(site: URL): string {
  return `${site.origin}/#person`;
}
