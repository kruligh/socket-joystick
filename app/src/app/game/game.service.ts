import {Injectable} from '@angular/core';
import {MenuGameEntry} from '../menu-games/MenuGameEntry';

@Injectable()
export class GameService {

  private mockedMenuGames: MenuGameEntry[] = [
    {name: 'Web Stick', id: 'WebStick', urlPathName: 'web-stick'},
    {name: 'Web Stick v2', id: 'WebStick', urlPathName: 'webstickv2'}
  ];

  public getGameByPath(gamePathUrl: string | null): MenuGameEntry {
    return this.mockedMenuGames.find(item => item.urlPathName === gamePathUrl);
  }

  public async getMenuGames() {
    return this.mockedMenuGames;
  }
}
