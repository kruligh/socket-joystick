import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebStickClientComponent } from './web-stick-client.component';

describe('WebStickClientComponent', () => {
  let component: WebStickClientComponent;
  let fixture: ComponentFixture<WebStickClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebStickClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebStickClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
