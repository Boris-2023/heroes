import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from '../interface/hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 1, name: 'Dr. Nice' },
      { id: 2, name: 'Bombasto' },
      { id: 3, name: 'Celeritas' },
      { id: 4, name: 'Magneta' },
      { id: 5, name: 'RubberMan' },
      { id: 6, name: 'Dynama' },
      { id: 7, name: 'Dr. IQ' },
      { id: 8, name: 'Magma' },
      { id: 9, name: 'Tornado' },
      { id: 10, name: 'Chapaev' },
    ];
    return {heroes};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
