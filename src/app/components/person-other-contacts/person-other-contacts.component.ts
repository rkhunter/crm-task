import pick from 'lodash.pick';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { PhoneDataSource } from 'src/app/services/phone.datasource';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PhoneService } from 'src/app/services/phone.service';
import { startWith, delay, tap } from 'rxjs/operators';
import { OtherContact } from 'src/app/models/other_contact.model';
import { OtherContactDataSource } from 'src/app/services/other_contact.datasource';
import { OtherContactService } from 'src/app/services/other_contact.service';
import { DialogService } from 'src/app/services/dialogue.service';

@Component({
  selector: 'app-person-other-contacts',
  templateUrl: './person-other-contacts.component.html',
  styleUrls: ['./person-other-contacts.component.scss']
})
export class PersonOtherContactsComponent implements OnInit {
  @Input() personId: string;

  pageSizeOptions: number[] = environment.PAGE_SIZE_OPTIONS;
  
  displayedColumns: string[] = [`status`, `information`, `isValid`, `edit`];
  
  private otherContacts: BehaviorSubject<OtherContact[]> = new BehaviorSubject<OtherContact[]>([]);
  dataSource: OtherContactDataSource;

  @ViewChild(MatPaginator, { static: true })
  phonesTablePaginator: MatPaginator;

  constructor(private dialogService: DialogService, private otherContactService: OtherContactService) { }

  ngOnInit() {
    this.dataSource = new OtherContactDataSource(this.otherContactService);

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
        tap((pe: PageEvent) => this.dataSource.loadOtherContacts(this.personId, { page: pe.pageIndex, limit: pe.pageSize })),
      )
      .subscribe();
  }

  showEditDialog(otherContact: OtherContact) {
    this.dialogService.showEditDialog({
      controls: this.packControlsForEditDialog(otherContact),
      title: `Edit status for other contact`,
      cancelButtonLabel: `Cancel`,
      confirmationButtonLabel: `UPDATE`
    }).subscribe(
      (values) =>
        this.otherContactService.updateOtherContactForPerson(
          new OtherContact({
            ...pick(otherContact, [`id`, `personId`, `status`, `information`, `isValid`]),
            ...values
          })
        ).subscribe(x => this.dataSource.performManualUpdateInStore([x]))
    );
  }

  private packControlsForEditDialog(otherContact: OtherContact) {
    return [
      {
        id: `isValid`,
        label: `Valid`,
        type: `radio`,
        options: [
          { label: `Valid`, value: true },
          { label: `Invalid`, value: false },
        ],
        value: otherContact.isValid
      }
    ]
  }
}
