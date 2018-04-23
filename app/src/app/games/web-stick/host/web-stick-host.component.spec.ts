import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebStickHostComponent } from './web-stick-host.component';

describe('WebStickHostComponent', () => {
  let component: WebStickHostComponent;
  let fixture: ComponentFixture<WebStickHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebStickHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebStickHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
