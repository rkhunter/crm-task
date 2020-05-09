import camelcase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api_response.interface';
import { extractPagination } from '../models/pagination.interface';
import { environment } from 'src/environments/environment';
import { Address, ADDRESS_STATUS } from '../models/address.model';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { convertToHttpParams } from '../utils/convert-to-http-options';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) {}

  getAddressesForPerson(person_id: string, options: { page: number, limit: number } = { page: 0,  limit: 10 }) {
    return this.httpClient.get(`${environment.API_URL}/persons/${person_id}/addresses`, { params: convertToHttpParams(options) }).pipe(
      map((response: ApiResponse) => ({
        ...extractPagination(response),
        addresses: response.items.map(x => new Address({ personId: person_id, ...mapKeys(x, (_, k) => camelcase(k)) }))
      })),
      catchError(error => throwError(error))
    );
  }

  updateAddressForPerson(address: Address) {
    address.addressStatus = ADDRESS_STATUS.PROCESSED;

    return this.httpClient.put(
      `${environment.API_URL}/persons/${address.personId}/addresses/${address.id}`,
      { ...address }
    ).pipe(
      map((response: any) => address),
      catchError(error => throwError(error))
    );
  }
}
