import {ComponentFixture, TestBed} from '@angular/core/testing';

import {initTestBed} from '../../test/helpers';
import {MenuGameEntry} from '../menu-games/MenuGameEntry';
import {GameComponent} from './game.component';
import {GameService} from './game.service';

class GameServiceMock {
  public gameByPath: MenuGameEntry;

  public getGameByPath(gamePathUrl: string | null): MenuGameEntry {
    return this.gameByPath;
  }
}


describe('GameComponent', () => {
  const gameServiceMock = new GameServiceMock();

  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;


  initTestBed({providers: [{ provide: GameService, useValue: gameServiceMock }]});

  beforeEach(async () => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });

  it('should show game', async () => {
    gameServiceMock.gameByPath = {id: 'mockedId', name: 'mockedName', urlPathName: 'mockedUrlPathName'};
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain(gameServiceMock.gameByPath.name);
  });

  it('should show error if game is null', async () => {
    gameServiceMock.gameByPath = null;
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('Error');
  });
});
