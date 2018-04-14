import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuGamesComponent} from './menu-games.component';
import {initTestBed} from '../../test/helpers';

describe('MenuGamesComponent', () => {
  let component: MenuGamesComponent;
  let fixture: ComponentFixture<MenuGamesComponent>;

  initTestBed({});

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
});
