import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';

import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {GameComponent} from './game/game.component';
import {GameService} from './game/game.service';
import {WebStickClientComponent} from './games/web-stick/client/web-stick-client.component';
import {WebStickHostComponent} from './games/web-stick/host/web-stick-host.component';
import {MenuGameEntryComponent} from './menu-games/game-entry/menu-game-entry.component';
import {MenuGamesComponent} from './menu-games/menu-games.component';

export const appModuleConfig = {
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MenuGameEntryComponent,
    MenuGamesComponent,
    GameComponent,
    WebStickHostComponent,
    WebStickClientComponent,
  ],
  entryComponents: [
    WebStickHostComponent,
    WebStickClientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [GameService]
};

@NgModule(appModuleConfig)
export class AppModule {
}
