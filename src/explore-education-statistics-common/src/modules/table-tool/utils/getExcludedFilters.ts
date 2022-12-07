import { FullTableMeta } from '@common/modules/table-tool/types/fullTable';

function getExcludedFilters(
  tableHeaderFilters: string[],
  subjectMeta: FullTableMeta,
): Set<string> {
  const subjectMetaFilters = [
    ...Object.values(subjectMeta.filters).flatMap(
      filterGroup => filterGroup.options,
    ),
    ...subjectMeta.timePeriodRange,
    ...subjectMeta.locations,
    ...subjectMeta.indicators,
  ].map(filter => filter.id);

  return new Set(
    subjectMetaFilters.filter(
      subjectMetaFilter => !tableHeaderFilters.includes(subjectMetaFilter),
    ),
  );
}
export default getExcludedFilters;
