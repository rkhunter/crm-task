import { AddressService } from './address.service';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { Address } from '../models/address.model';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { OtherContactService } from './other_contact.service';
import { OtherContact } from '../models/other_contact.model';


export class OtherContactDataSource implements DataSource<OtherContact> {
    private dataBehaviorSubject = new BehaviorSubject<OtherContact[]>([]);
    private totalItemsBehaviorSubject = new BehaviorSubject<number>(-1);
    private isLoadingBehaviorSubject = new BehaviorSubject<boolean>(false);
    private lastUpdatedSubject = new Subject<Date>();

    public isLoading$ = this.isLoadingBehaviorSubject.asObservable();
    public totalItems$ = this.totalItemsBehaviorSubject.asObservable();
    public lastUpdated$ = this.lastUpdatedSubject.asObservable();

    constructor(private otherContactService: OtherContactService) {}

    connect(collectionViewer: CollectionViewer): Observable<OtherContact[]> {
        return this.dataBehaviorSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataBehaviorSubject.complete();
        this.isLoadingBehaviorSubject.complete();
        this.totalItemsBehaviorSubject.complete();
        this.lastUpdatedSubject.complete();
    }

    performManualUpdateInStore(updates: OtherContact[]) {
        this.dataBehaviorSubject.next(
            this.dataBehaviorSubject.getValue().map(x => {
                const upd = updates.find(y => y.id === x.id)

                if(upd) {
                    return upd;
                }

                return x;
            })
        );
    }

    loadOtherContacts(person_id: string, options: { page: number,  limit: number } = { page: 0,  limit: 10 }) {
        this.isLoadingBehaviorSubject.next(true);

        this.otherContactService.getOtherContactsForPerson(person_id, options).pipe(
            catchError(() => of([])),
            finalize(() => this.isLoadingBehaviorSubject.next(false))
        )
        .subscribe((response: { page: number, totalPages: number, totalCount: number, otherContacts: OtherContact[] }) => {
            this.dataBehaviorSubject.next(response.otherContacts);
            this.totalItemsBehaviorSubject.next(response.totalCount);
            this.lastUpdatedSubject.next(new Date());
        });
    }
}