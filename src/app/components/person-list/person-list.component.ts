import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Person } from 'src/app/models/person.model';
import { PersonService } from 'src/app/services/person.service';
import { takeUntil, pluck, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {

  private _destroyed$ = new Subject<any>();

  persons$: Observable<Person[]>;
  
  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.persons$ = this.personService.getAll()
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  personsTrackByFn(index, item) {
    return item.id;
  }
}
