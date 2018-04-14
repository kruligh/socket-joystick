import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';

import {GameService} from './game/game.service';
import {AppComponent} from './app.component';
import {GameComponent} from './game/game.component';
import {MenuGameEntryComponent} from './menu-games/game-entry/menu-game-entry.component';
import {MenuGamesComponent} from './menu-games/menu-games.component';

export const appModuleConfig = {
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MenuGameEntryComponent,
    MenuGamesComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [GameService]
};

@NgModule(appModuleConfig)
export class AppModule {
}
