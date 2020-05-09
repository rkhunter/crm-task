import { AddressService } from './address.service';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { Address } from '../models/address.model';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';


export class AddressDataSource implements DataSource<Address> {
    private dataBehaviorSubject = new BehaviorSubject<Address[]>([]);
    private totalItemsBehaviorSubject = new BehaviorSubject<number>(-1);
    private isLoadingBehaviorSubject = new BehaviorSubject<boolean>(false);
    private lastUpdatedSubject = new Subject<Date>();

    public isLoading$ = this.isLoadingBehaviorSubject.asObservable();
    public totalItems$ = this.totalItemsBehaviorSubject.asObservable();
    public lastUpdated$ = this.lastUpdatedSubject.asObservable();

    constructor(private addressesService: AddressService) {}

    connect(collectionViewer: CollectionViewer): Observable<Address[]> {
        return this.dataBehaviorSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataBehaviorSubject.complete();
        this.isLoadingBehaviorSubject.complete();
        this.totalItemsBehaviorSubject.complete();
        this.lastUpdatedSubject.complete();
    }

    performManualUpdateInStore(updates: Address[]) {
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

    loadAddresses(person_id: string, options: { page: number,  limit: number } = { page: 0,  limit: 10 }) {
        this.isLoadingBehaviorSubject.next(true);

        this.addressesService.getAddressesForPerson(person_id, options).pipe(
            catchError(() => of([])),
            finalize(() => this.isLoadingBehaviorSubject.next(false))
        )
        .subscribe((response: { page: number, totalPages: number, totalCount: number, addresses: Address[] }) => {
            this.dataBehaviorSubject.next(response.addresses);
            this.totalItemsBehaviorSubject.next(response.totalCount);
            this.lastUpdatedSubject.next(new Date());
        });
    }
}