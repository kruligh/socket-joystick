import {TestBed} from '@angular/core/testing';
import {initTestBed} from '../test/helpers';
import {AppComponent} from './app.component';

describe('AppComponent', () => {

  initTestBed({});

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title in a h1 tag', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('HorizonDev feat Yeahbunny');
  });
});