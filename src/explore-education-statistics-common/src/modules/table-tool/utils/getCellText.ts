import { ExpandedDataSet } from '@common/modules/charts/types/dataSet';
import { getIndicatorPath } from '@common/modules/charts/util/groupResultMeasuresByDataSet';
import { EMPTY_CELL_TEXT } from '@common/modules/table-tool/components/TimePeriodDataTable';
import { Dictionary } from '@common/types';
import formatPretty from '@common/utils/number/formatPretty';
import get from 'lodash/get';

function getCellText(
  measuresByDataSet: Dictionary<unknown>,
  dataSet: ExpandedDataSet,
): string {
  const { location, timePeriod, filters, indicator } = dataSet;

  const path = getIndicatorPath({
    filters: filters.map(filter => filter.value),
    location: location
      ? {
          value: location.value,
          level: location.level,
        }
      : undefined,
    timePeriod: timePeriod?.value,
    indicator: indicator?.value,
  });

  const value = get(measuresByDataSet, path);

  if (typeof value === 'undefined') {
    return EMPTY_CELL_TEXT;
  }

  if (Number.isNaN(Number(value))) {
    return value;
  }

  return formatPretty(value, indicator.unit, indicator.decimalPlaces);
}

export default getCellText;
