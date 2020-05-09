import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PersondetailsComponent } from './components/persondetails/persondetails.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { PersonPhonesComponent } from './components/person-phones/person-phones.component';
import { PersonAddressesComponent } from './components/person-addresses/person-addresses.component';
import { PersonOtherContactsComponent } from './components/person-other-contacts/person-other-contacts.component';
import { PrettyPhoneNumberPipe } from './pipes/pretty-phone.pipe'
import { FormatAddressPipe } from './pipes/format-address.pipe'
import { MockDataInterceptor } from './interceptors/mock-data.interceptor';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    PersondetailsComponent,
    PersonListComponent,
    PersonPhonesComponent,
    PersonAddressesComponent,
    PersonOtherContactsComponent,
    PrettyPhoneNumberPipe,
    FormatAddressPipe,
    EditDialogComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockDataInterceptor,
      multi: true
    }
  ],
  entryComponents: [
      EditDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
