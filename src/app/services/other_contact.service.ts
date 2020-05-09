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
import { OtherContact, OTHER_CONTACT_STATUS } from '../models/other_contact.model';

@Injectable({
  providedIn: 'root'
})
export class OtherContactService {

  constructor(private httpClient: HttpClient) {}

  getOtherContactsForPerson(person_id: string, options: { page: number, limit: number } = { page: 0,  limit: 10 }) {
    return this.httpClient.get(`${environment.API_URL}/persons/${person_id}/other-contacts`, { params: convertToHttpParams(options) }).pipe(
      map((response: ApiResponse) => ({
        ...extractPagination(response),
        otherContacts: response.items.map(x => new OtherContact({ personId: person_id, ...mapKeys(x, (_, k) => camelcase(k)) }))
      })),
      catchError(error => throwError(error))
    );
  }

  updateOtherContactForPerson(otherContact: OtherContact) {
    otherContact.status = OTHER_CONTACT_STATUS.PROCESSED;

    return this.httpClient.put(
      `${environment.API_URL}/persons/${otherContact.personId}/other-contacts/${otherContact.id}`,
      { ...otherContact }
    ).pipe(
      map((response: any) => otherContact),
      catchError(error => throwError(error)
    ));
  }
}
