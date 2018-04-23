import {Component, OnInit} from '@angular/core';
import {GameService} from '../game/game.service';
import {MenuGameEntry} from './MenuGameEntry';

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
