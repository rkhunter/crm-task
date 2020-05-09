import isNil from 'lodash.isnil';
import pick from 'lodash.pick';
import camelcase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import mapValues from 'lodash.mapvalues';
import { ApiResponse } from './api_response.interface';

export interface Pagination {
    page: number;
    totalPages: number;
    totalCount: number;
}

export const extractPagination =
    (x: ApiResponse): Pagination =>
        <Pagination> mapValues(
            mapKeys(
                pick(x, `page`, `total_pages`, `total_count`),
                (_, k) => camelcase(k)
            ),
            x => isNil(x) ? x : +x
        );