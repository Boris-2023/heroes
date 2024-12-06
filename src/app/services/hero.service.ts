import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Hero} from '../hero';
import {MessageService} from './message.service';
import {HEROES} from '../mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) {
  }

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);// returns an Observable of heroes, which emits a single value - array of heroes
                              //  -> the same signature as of Http.Client.get<Hero[]>()
    this.messageService.add('heroService: fetched heroes')
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
}
