import { defineHastPlugin, type HastNode } from 'satteri';

type Element = Extract<HastNode, { type: 'element' }>;
type Child = Element['children'][number];

/**
 * Wraps each h2 and the blocks that follow it in the markup of the Section
 * component, so a doc body lays out like every other block on the site:
 * the heading is the label in columns 1–4, the prose sits in 5–12.
 * Anything before the first h2 (imports, for one) stays where it is.
 * The markup mirrors src/components/layout/Section.astro (split layout); change both together.
 */
export function sections() {
  return defineHastPlugin({
    name: 'sections',
    after(root, ctx) {
      ctx.replaceNode(root, { type: 'root', children: group(root.children as Child[]) });
    }
  });
}

function group(children: Child[]): Child[] {
  const out: Child[] = [];
  let prose: Element | undefined;

  for (const child of children) {
    if (child.type === 'element' && child.tagName === 'h2') {
      const label: Element = {
        type: 'element',
        tagName: 'h2',
        properties: { ...child.properties, className: ['ag-section__label'] },
        children: child.children
      };
      prose = element('div', 'ag-prose');
      const body = element('div', 'ag-section__body', [prose]);
      const head = element('div', 'ag-section__head', [label, body]);
      out.push(element('section', 'ag-section', [head]));
    } else if (prose) {
      prose.children.push(child);
    } else {
      out.push(child);
    }
  }

  return out;
}

function element(tagName: string, className: string, children: Child[] = []): Element {
  return { type: 'element', tagName, properties: { className: [className] }, children };
}
