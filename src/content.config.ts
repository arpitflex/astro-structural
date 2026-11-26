import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TRACE } from './data/trace';

// One MDX file per doc in src/content/docs. The file name is the URL: pm4.mdx is /docs/pm4.
const docs = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/docs' }),
  schema: z.object({
    kind: z.enum(['pm', 'adr', 'note']),
    title: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    // Links the doc to a trace group; the trace page lists docs under their period.
    trace: z
      .string()
      .refine((id) => TRACE.some((group) => group.id === id), { message: 'unknown trace id' })
      .optional(),
    // Header facts, in order: { status: resolved, duration: 3h 12m }
    facts: z.record(z.string(), z.string()).optional(),
    // Incident chronology, rendered with <Timeline events={frontmatter.timeline} /> in the body.
    timeline: z
      .array(
        z.object({
          time: z.string(),
          text: z.string(),
          delta: z.string().optional(),
          tag: z.string().optional(),
          resolved: z.boolean().optional()
        })
      )
      .optional()
  })
});

export const collections = { docs };
