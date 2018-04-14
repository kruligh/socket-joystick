import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGameEntryComponent } from './menu-game-entry.component';

describe('MenuGameEntryComponent', () => {
  let component: MenuGameEntryComponent;
  let fixture: ComponentFixture<MenuGameEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuGameEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGameEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
