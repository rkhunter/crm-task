import camelcase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api_response.interface';
import { extractPagination } from '../models/pagination.interface';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address.model';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { convertToHttpParams } from '../utils/convert-to-http-options';
import { Phone, PHONE_STATUS } from '../models/phone.model';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(private httpClient: HttpClient) {}

  getPhonesForPerson(person_id: string, options: { page: number, limit: number } = { page: 0,  limit: 10 }) {
    return this.httpClient.get(`${environment.API_URL}/persons/${person_id}/phones`, { params: convertToHttpParams(options) }).pipe(
      map((response: ApiResponse) => ({
        ...extractPagination(response),
        phones: response.items.map(x => new Phone({ personId: person_id, ...mapKeys(x, (_, k) => camelcase(k)) }))
      })),
      catchError(error => throwError(error))
    );
  }

  updatePhoneForPerson(phone: Phone) {
    phone.phoneStatus = PHONE_STATUS.PROCESSED;

    return this.httpClient.put(
      `${environment.API_URL}/persons/${phone.personId}/phones/${phone.id}`,
      { ...phone }
    ).pipe(
      map((response: any) => phone),
      catchError(error => throwError(error)
    ));
  }
}
