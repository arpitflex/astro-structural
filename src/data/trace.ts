/** A month written YYYY-MM, zero-padded so months sort and compare as strings. */
export type Month = `${number}-${0 | 1}${number}`;

export interface TraceRole {
  name: string;
  start: Month;
  /** Left out while the role is current. */
  end?: Month;
}

export interface TraceGroup {
  id: string;
  name: string;
  place: string;
  kind: 'work' | 'study';
  systems: string;
  context: string;
  /** Most recent first: the first role bounds the end of the group and the last its start. */
  roles: TraceRole[];
}

/** Career and education trace, most recent first. Edit this file when a role changes. */
export const TRACE: TraceGroup[] = [
  {
    id: 'acme',
    name: 'acme systems',
    place: 'san francisco, ca',
    kind: 'work',
    systems: 'go · kubernetes · postgres · grpc',
    context:
      'Leading reliability and compute scheduling for internal service fleets, focusing on predictable latency under failover.',
    roles: [{ name: 'staff systems engineer', start: '2024-03' }]
  },
  {
    id: 'northstar',
    name: 'northstar labs',
    place: 'chicago, il',
    kind: 'work',
    systems: 'typescript · rust · kafka · terraform',
    context:
      'Built deployment tooling, structured logging pipelines, and multi-region batch orchestration for internal engineering teams.',
    roles: [
      { name: 'senior engineer', start: '2022-06', end: '2024-03' },
      { name: 'software engineer', start: '2021-01', end: '2022-06' }
    ]
  },
  {
    id: 'state-u',
    name: 'state university',
    place: 'ann arbor, mi',
    kind: 'study',
    systems: 'distributed systems · compilers',
    context: 'Computer science studies centered on operating systems, consensus protocols, and static analysis.',
    roles: [{ name: 'msc computer science', start: '2019-09', end: '2021-01' }]
  }
];
