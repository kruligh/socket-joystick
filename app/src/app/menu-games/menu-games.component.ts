import {Component, OnInit} from '@angular/core';
import {MenuGameEntry} from './MenuGameEntry';
import {GameService} from '../game/game.service';

@Component({
  selector: 'menu-games',
  styleUrls: ['./menu-games.component.css'],
  templateUrl: './menu-games.component.html'
})
export class MenuGamesComponent implements OnInit {

  public games: MenuGameEntry[];

  constructor(private gameService: GameService) {
  }

  public async ngOnInit() {
    this.games = await this.gameService.getMenuGames();
  }

}
