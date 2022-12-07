import { CategoryFilter, Filter, TimePeriodFilter } from '../../types/filters';
import optimizeFilters from '../optimizeFilters';

const testFilter: Filter[] = [
  new TimePeriodFilter({
    label: '2020 Week 14',
    year: 2020,
    code: 'W14',
    order: 1,
  }),
];

const testHeaderConfig = [
  [
    new TimePeriodFilter({
      label: '2020 Week 13',
      year: 2020,
      code: 'W13',
      order: 0,
    }),
    new TimePeriodFilter({
      label: '2020 Week 14',
      year: 2020,
      code: 'W14',
      order: 1,
    }),
  ],
];

describe('optimizeFilters', () => {
  test('returns an optimized TimePeriodFilter', () => {
    expect(optimizeFilters(testFilter, testHeaderConfig)).toEqual([
      new TimePeriodFilter({
        // value: '2020_W14',
        label: '2020 Week 14',
        year: 2020,
        code: 'W14',
        order: 1,
      }),
    ] );
  });

  test('')
});
