import { PhoneService } from './phone.service';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { Phone } from '../models/phone.model';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';


export class PhoneDataSource implements DataSource<Phone> {
    private dataBehaviorSubject = new BehaviorSubject<Phone[]>([]);
    private totalItemsBehaviorSubject = new BehaviorSubject<number>(-1);
    private isLoadingBehaviorSubject = new BehaviorSubject<boolean>(false);
    private lastUpdatedSubject = new Subject<Date>();

    public isLoading$ = this.isLoadingBehaviorSubject.asObservable();
    public totalItems$ = this.totalItemsBehaviorSubject.asObservable();
    public lastUpdated$ = this.lastUpdatedSubject.asObservable();

    constructor(private phoneService: PhoneService) {}

    connect(collectionViewer: CollectionViewer): Observable<Phone[]> {
        return this.dataBehaviorSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataBehaviorSubject.complete();
        this.isLoadingBehaviorSubject.complete();
        this.totalItemsBehaviorSubject.complete();
        this.lastUpdatedSubject.complete();
    }

    performManualUpdateInStore(updates: Phone[]) {
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

    loadPhones(person_id: string, options: { page: number,  limit: number } = { page: 0,  limit: 10 }) {
        this.isLoadingBehaviorSubject.next(true);

        this.phoneService.getPhonesForPerson(person_id, options).pipe(
            catchError(() => of([])),
            finalize(() => this.isLoadingBehaviorSubject.next(false))
        )
        .subscribe((response: { page: number, totalPages: number, totalCount: number, phones: Phone[] }) => {
            this.dataBehaviorSubject.next(response.phones);
            this.totalItemsBehaviorSubject.next(response.totalCount);
            this.lastUpdatedSubject.next(new Date());
        });
    }
}