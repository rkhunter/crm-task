import pick from 'lodash.pick';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AddressService } from 'src/app/services/address.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AddressDataSource } from 'src/app/services/address.datasource';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { environment } from 'src/environments/environment';
import { startWith, delay, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialogue.service';

@Component({
  selector: 'app-person-addresses',
  templateUrl: './person-addresses.component.html',
  styleUrls: ['./person-addresses.component.scss']
})
export class PersonAddressesComponent implements OnInit {
  @Input() personId: string;

  pageSizeOptions: number[] = environment.PAGE_SIZE_OPTIONS;
  
  displayedColumns: string[] = [`addressStatus`, `address`, `visited`, `edit`];
  
  private addresses: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>([]);
  dataSource: AddressDataSource;

  @ViewChild(MatPaginator, { static: true })
  addressesTablePaginator: MatPaginator;

  constructor(private dialogService: DialogService, private addressService: AddressService) { }

  ngOnInit() {

    this.dataSource = new AddressDataSource(this.addressService);

    this.addressesTablePaginator.page
      .pipe(
        startWith(
          ((p: { pageIndex: number, pageSize: number }) => {
            const pe = new PageEvent();
            pe.pageIndex = p.pageIndex;
            pe.pageSize = p.pageSize;
            return pe;
          })({ pageIndex: this.addressesTablePaginator.pageIndex, pageSize: this.addressesTablePaginator.pageSize || this.pageSizeOptions[0] })
        ),
        delay(0),
        tap((pe: PageEvent) => this.dataSource.loadAddresses(this.personId, { page: pe.pageIndex, limit: pe.pageSize })),
      )
      .subscribe();
  }

  showEditDialog(address: Address) {
    this.dialogService.showEditDialog({
      controls: this.packControlsForEditDialog(address),
      title: `Edit status for address`,
      cancelButtonLabel: `Cancel`,
      confirmationButtonLabel: `UPDATE`
    }).subscribe(
      (values) =>
        this.addressService.updateAddressForPerson(
          new Address({
            ...pick(address, [`id`, `personId`, `streetAddress`, `city`, `region`, `postal`, `country`, `addressStatus`, `visited`]),
            ...values
          })
        ).subscribe(x => this.dataSource.performManualUpdateInStore([x]))
    );
  }

  private packControlsForEditDialog(address: Address) {
    return [
      {
        id: `visited`,
        label: `Visited`,
        type: `radio`,
        options: [
          { label: `Visited`, value: true },
          { label: `Not visited`, value: false },
          { label: `Unknown`, value: null },
        ],
        value: address.visited
      }
    ]
  }
}
