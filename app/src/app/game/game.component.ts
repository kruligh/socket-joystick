import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PARAM_GAME_URL} from '../app-routing.params';
import {MenuGameEntry} from '../menu-games/MenuGameEntry';
import {GameService} from './game.service';

@Component({
  selector: 'app-game',
  styleUrls: ['./game.component.css'],
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {

  private game: MenuGameEntry;
  private error: string;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
  }

  public async ngOnInit() {
    const gamePathUrl = this.route.snapshot.paramMap.get(PARAM_GAME_URL);
    this.game = null;
    const game = this.gameService.getGameByPath(gamePathUrl);
    if (game) {
      this.game = game;
      this.error = null;
    } else {
      this.error = 'Error';
    }
  }
}
