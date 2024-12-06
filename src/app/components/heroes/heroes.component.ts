import {Component, OnInit} from '@angular/core';
import {Hero} from '../../hero';
import {HeroService} from '../../services/hero.service';
import {MessageService} from '../../services/message.service';
import {HEROES} from '../../mock-heroes';

@Component({
  selector: 'app-heroes',
  standalone: false,
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css'
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
}
