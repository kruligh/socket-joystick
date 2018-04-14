import {Injectable} from '@angular/core';
import {MenuGameEntry} from '../menu-games/MenuGameEntry';

@Injectable()
export class GameService {

  public getGameByPath(gamePathUrl: string | null): MenuGameEntry {
      return {
        id: 'WebStick',
        name: 'WebStick',
        urlPathName: 'webstick',
      };
  }

  public async getMenuGames() {
    return [
      {name: 'Web Stick', id: 'WebStick', urlPathName: 'webstick'},
      {name: 'Web Stick v2', id: 'WebStick', urlPathName: 'webstick'}
    ];
  }
}
