import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import mapKeys from 'lodash.mapKeys';
import camelcase from 'lodash.camelcase';
import { ApiResponse } from '../models/api_response.interface';
import { extractPagination } from '../models/pagination.interface';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Person[]> {
    return this.httpClient.get(`${environment.API_URL}/persons`).pipe(
      map((response: any[]) => response.map(x => new Person(mapKeys(x, (_, k) => camelcase(k)))),
      catchError(error => throwError(error))
    ));
  }

  getPerson(person_id: string): Observable<Person> {
    return this.httpClient.get(`${environment.API_URL}/persons/${person_id}`).pipe(
      map((response: any) => new Person(mapKeys(response, (_, k) => camelcase(k))),
      catchError(error => throwError(error))
    ));
  }
}
