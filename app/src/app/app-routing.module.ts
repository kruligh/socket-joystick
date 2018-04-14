import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import {PARAM_GAME_URL} from './app-routing.params';

const routes: Routes = [
  { path: `:${PARAM_GAME_URL}`, component: GameComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
