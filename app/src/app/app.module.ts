import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {MenuGameEntryComponent} from './menu-games/game-entry/menu-game-entry.component';
import {MenuGamesComponent} from './menu-games/menu-games.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MenuGameEntryComponent,
    MenuGamesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: []
})
export class AppModule {
}
