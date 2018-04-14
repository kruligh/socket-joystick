import {Component, OnInit} from '@angular/core';
import {MenuGameEntry} from './MenuGameEntry';

@Component({
  selector: 'menu-games',
  styleUrls: ['./menu-games.component.css'],
  templateUrl: './menu-games.component.html'
})
export class MenuGamesComponent implements OnInit {

  public games: MenuGameEntry[];

  public ngOnInit() {
    this.games = [
      {name: 'Web Stick', id: 'WebStick', urlPathName: 'webstick'},
      {name: 'Web Stick v2', id: 'WebStick', urlPathName: 'webstick'}
    ];
  }

}
