import {Component, Input} from '@angular/core';
import {MenuGameEntry} from '../MenuGameEntry';

@Component({
  selector: 'menu-game-entry',
  styleUrls: ['./menu-game-entry.component.css'],
  templateUrl: './menu-game-entry.component.html'
})
export class MenuGameEntryComponent {
  @Input() public game: MenuGameEntry;
}
