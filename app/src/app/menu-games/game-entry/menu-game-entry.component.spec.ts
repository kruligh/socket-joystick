import {ComponentFixture, TestBed} from '@angular/core/testing';

import {initTestBed} from '../../../test/helpers';
import {MenuGameEntryComponent} from './menu-game-entry.component';

describe('MenuGameEntryComponent', () => {
  let component: MenuGameEntryComponent;
  let fixture: ComponentFixture<MenuGameEntryComponent>;

  initTestBed({});

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGameEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
