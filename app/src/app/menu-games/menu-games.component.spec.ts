import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGamesComponent } from './menu-games.component';
import {MenuGameEntryComponent} from './game-entry/menu-game-entry.component';

describe('MenuGamesComponent', () => {
  let component: MenuGamesComponent;
  let fixture: ComponentFixture<MenuGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuGamesComponent, MenuGameEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
