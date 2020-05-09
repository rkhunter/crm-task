import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersondetailsComponent } from './components/persondetails/persondetails.component';


const routes: Routes = [
  { path: `person-details/:person_id`, component: PersondetailsComponent },
  { path: `person-details/:person_id/phones`, component: PersondetailsComponent },
  { path: `person-details/:person_id/addresses`, component: PersondetailsComponent },
  { path: `person-details/:person_id/other-contacts`, component: PersondetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
