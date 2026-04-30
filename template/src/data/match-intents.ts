export interface CuratedIntent {
  id: string;
  label: string;
  query: string;
  unit: string;
  topSlugs: string[];
}

export const curatedIntents: CuratedIntent[] = [
  {
    id: 'TODO_INTENT_1',
    label: 'TODO_LABEL_1',
    query: 'TODO_QUERY_EXPANDIDA_1',
    unit: 'TODO_UNIT',
    topSlugs: ['TODO_SLUG_1', 'TODO_SLUG_2'],
  },
  {
    id: 'TODO_INTENT_2',
    label: 'TODO_LABEL_2',
    query: 'TODO_QUERY_EXPANDIDA_2',
    unit: 'TODO_UNIT',
    topSlugs: ['TODO_SLUG_1'],
  },
];
