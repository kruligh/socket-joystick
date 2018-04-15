import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PARAM_GAME_URL} from './app-routing.params';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: `:${PARAM_GAME_URL}`, component: GameComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes,  {onSameUrlNavigation: 'reload'})]
})
export class AppRoutingModule { }
