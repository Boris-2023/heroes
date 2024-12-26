import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CandlesComponent} from '../components/candles/candles.component';
import {HeroDetailComponent} from '../components/hero-detail/hero-detail.component';
import {HeroesComponent} from '../components/heroes/heroes.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {QuestComponent} from '../components/quest/quest.component';

const routes: Routes = [
  {path: 'heroes', component: HeroesComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'quest', component: QuestComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},// by default
  {path: 'detail/:id', component: HeroDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
