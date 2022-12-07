import Header from '@common/modules/table-tool/components/utils/Header';
import { Filter } from '@common/modules/table-tool/types/filters';
import last from 'lodash/last';

/**
 * Convert {@param filters} into {@see Header} instances
 * and add them to {@param headers}.
 */
function addFilters(headers: Header[], filters: Filter[]): Header[] {
  filters.forEach((filter, filterIndex) => {
    if (!headers.length) {
      headers.push(new Header(filter.id, filter.label));
      return;
    }

    const currentHeader = last(headers);

    if (!currentHeader) {
      return;
    }

    if (currentHeader.id === filter.id) {
      currentHeader.span += 1;
    } else if (filterIndex === 0) {
      headers.push(new Header(filter.id, filter.label));
    } else {
      currentHeader.addChildToLastParent(
        new Header(filter.id, filter.label),
        filterIndex - 1,
      );
    }
  });

  return headers;
}
export default addFilters;
