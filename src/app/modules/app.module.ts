import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatRadioModule} from '@angular/material/radio';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from '../services/in-memory-data.service';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from '../app.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {HeroDetailComponent} from '../components/hero-detail/hero-detail.component';
import {HeroesComponent} from '../components/heroes/heroes.component';
import {MessageComponent} from '../components/message/message.component';
import {HeroSearchComponent} from '../components/hero-search/hero-search.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatRadioModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ),
    MatDialogModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessageComponent,
    HeroSearchComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
