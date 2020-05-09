import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { pluck, takeUntil, mergeMap } from 'rxjs/operators';
import uniq from 'lodash.uniq';
import { Person } from 'src/app/models/person.model';
import { PersonService } from 'src/app/services/person.service';
import { MatTabChangeEvent } from '@angular/material/tabs';



@Component({
  selector: 'app-persondetails',
  templateUrl: './persondetails.component.html',
  styleUrls: ['./persondetails.component.scss']
})
export class PersondetailsComponent implements OnInit, OnDestroy {
  private _destroyed$ = new Subject<any>();

  person$: Observable<Person | null>;
  
  constructor(private route: ActivatedRoute, private personService: PersonService) { }

  previouslySelectedTabs: number[] = [0];

  ngOnInit() {
    this.person$ = this.route.params
      .pipe(
          takeUntil(this._destroyed$),
          pluck('person_id'),
          mergeMap(id => this.personService.getPerson(id))
      )
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.previouslySelectedTabs = uniq([...this.previouslySelectedTabs, tabChangeEvent.index]);
  }
}
