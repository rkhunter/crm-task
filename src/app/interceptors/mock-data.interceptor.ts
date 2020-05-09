import paginate from 'paginate-array';
import isNil from 'lodash.isnil';
import mapValues from 'lodash.mapvalues';
import pick from 'lodash.pick';
import omitBy from 'lodash.omitby';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { convertMapToObject } from '../utils/convert-map-to-object';
import { Phone } from '../models/phone.model';
import { Address } from '../models/address.model';
import { OtherContact } from '../models/other_contact.model';

let persons = require('../../../mock-data/persons.json');
let phones = require('../../../mock-data/phones.json');
let addresses = require('../../../mock-data/addresses.json');
let otherContacts = require('../../../mock-data/other-contacts.json');

const paginateCollection = (c: any[], o: { page: number, limit: number } = { page: 0, limit: 10 }): { items: any[], page: number, total_pages: number, total_count: number } => {
    const options = Object.assign({ page: 0, limit: 10 }, o);

    const p = paginate(c, options.page + 1, options.limit);

    return {
        page: p.currentPage,
        total_count: p.total,
        total_pages: p.totalPages,
        items: p.data
    };
}

const extractPaginationOptions = request => {
    const q = convertMapToObject(request.params.map);
    return mapValues(omitBy(pick(q, [`page`, `limit`]), v => isNil(v)), v => v[0]);
}

const PUT = `PUT`

@Injectable()
export class MockDataInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (/^http:\/\/localhost:3001\/persons$/.test(request.url)) {
            return this.handlePersons(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d$/.test(request.url)) {
            return this.handlePerson(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d\/phones\/\d/.test(request.url)) {
            return this.handlePhone(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d\/phones/.test(request.url)) {
            return this.handlePhones(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d\/addresses\/\d/.test(request.url)) {
            return this.handleAddress(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d\/addresses/.test(request.url)) {
            return this.handleAddresses(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d\/other-contacts\/\d/.test(request.url)) {
            return this.handleOtherContact(request, next);
        }
        if (/^http:\/\/localhost:3001\/persons\/\d\/other-contacts/.test(request.url)) {
            return this.handleOtherContacts(request, next);
        }
        return next.handle(request);
    }

    handlePhone(request, next) {
        if (request.method === PUT) {
            const id = +request.url.match(/^http:\/\/localhost:3001\/persons\/\d\/phones\/(\d)$/)[1]
            const index = phones.findIndex(x => x.id === id);

            phones[index] = new Phone({
                ...pick(phones[index], [`id`, `personId`, `phone`, `phoneStatus`, `canBeDialed`]),
                ...request.body
            })
            return of(new HttpResponse({ status: 200 }));
        }
        return next.handle(request);
    }

    handlePhones(request, next) {
        const paginationOptions = extractPaginationOptions(request);

        return of(new HttpResponse({ status: 200, body: paginateCollection(phones, paginationOptions) }));
    }

    handleAddress(request, next) {
        if (request.method === PUT) {
            const id = +request.url.match(/^http:\/\/localhost:3001\/persons\/\d\/addresses\/(\d)$/)[1]
            const index = addresses.findIndex(x => x.id === id);

            addresses[index] = new Address({
                ...pick(addresses[index], [`id`, `personId`, `streetAddress`, `city`, `region`, `postal`, `country`, `addressStatus`, `visited`]),
                ...request.body
            })
            return of(new HttpResponse({ status: 200 }));
        }
        return next.handle(request);
    }

    handleAddresses(request, next) {
        const paginationOptions = extractPaginationOptions(request);

        return of(new HttpResponse({ status: 200, body: paginateCollection(addresses, paginationOptions) }));
    }

    handleOtherContact(request, next) {
        if (request.method === PUT) {
            const id = +request.url.match(/^http:\/\/localhost:3001\/persons\/\d\/other-contacts\/(\d)$/)[1]
            const index = otherContacts.findIndex(x => x.id === id);

            otherContacts[index] = new OtherContact({
                ...pick(otherContacts[index], [`id`, `personId`, `status`, `information`, `isValid`]),
                ...request.body
            })
            return of(new HttpResponse({ status: 200 }));
        }
        return next.handle(request);
    }

    handleOtherContacts(request, next) {
        const paginationOptions = extractPaginationOptions(request);

        return of(new HttpResponse({ status: 200, body: paginateCollection(otherContacts, paginationOptions) }));
    }

    handlePersons(request, next) {
        return of(new HttpResponse({ status: 200, body: persons }));
    }

    handlePerson(request, next) {
        return of(new HttpResponse({ status: 200, body: persons[0] }));
    }
}