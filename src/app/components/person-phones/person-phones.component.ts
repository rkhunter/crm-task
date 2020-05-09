import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Phone } from 'src/app/models/phone.model';
import { map, startWith, delay, tap } from 'rxjs/operators';
import { PhoneService } from 'src/app/services/phone.service';
import { PhoneDataSource } from 'src/app/services/phone.datasource';
import { DialogService } from 'src/app/services/dialogue.service';
import { Person } from 'src/app/models/person.model';
import pick from 'lodash.pick';

@Component({
  selector: 'app-person-phones',
  templateUrl: './person-phones.component.html',
  styleUrls: ['./person-phones.component.scss']
})
export class PersonPhonesComponent implements OnInit {
  @Input() personId: string;

  pageSizeOptions: number[] = environment.PAGE_SIZE_OPTIONS;
  
  displayedColumns: string[] = [`phoneStatus`, `phone`, `canBeDialed`, `edit`];
  
  private phones: BehaviorSubject<Phone[]> = new BehaviorSubject<Phone[]>([]);
  dataSource: PhoneDataSource;

  @ViewChild(MatPaginator, { static: true })
  phonesTablePaginator: MatPaginator;

  constructor(private phoneService: PhoneService, private dialogService: DialogService) { }

  ngOnInit() {
    this.dataSource = new PhoneDataSource(this.phoneService);

    this.phonesTablePaginator.page
      .pipe(
        startWith(
          ((p: { pageIndex: number, pageSize: number }) => {
            const pe = new PageEvent();
            pe.pageIndex = p.pageIndex;
            pe.pageSize = p.pageSize;
            return pe;
          })({ pageIndex: this.phonesTablePaginator.pageIndex, pageSize: this.phonesTablePaginator.pageSize || this.pageSizeOptions[0] })
        ),
        delay(0),
        tap((pe: PageEvent) => this.dataSource.loadPhones(this.personId, { page: pe.pageIndex, limit: pe.pageSize })),
      )
      .subscribe();
  }

  showEditDialog(phone: Phone) {
    this.dialogService.showEditDialog({
      controls: this.packControlsForEditDialog(phone),
      title: `Edit status for phone`,
      cancelButtonLabel: `Cancel`,
      confirmationButtonLabel: `UPDATE`
    }).subscribe(
      (values) =>
        this.phoneService.updatePhoneForPerson(
          new Phone({
            ...pick(phone, [`id`, `personId`, `phone`, `phoneStatus`, `canBeDialed`]),
            ...values
          })
        ).subscribe(x => this.dataSource.performManualUpdateInStore([x]))
    );
  }

  private packControlsForEditDialog(phone: Phone) {
    return [
      {
        id: `canBeDialed`,
        label: `Can be dialed`,
        type: `radio`,
        options: [
          { label: `Valid`, value: true },
          { label: `Invalid`, value: false },
          { label: `Unknown`, value: null },
        ],
        value: phone.canBeDialed
      }
    ]
  }
}
