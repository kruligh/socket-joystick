import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiMethod} from '../web-stick.api';

@Component({
  selector: 'app-webstick-client',
  styleUrls: ['./web-stick-client.component.css'],
  templateUrl: './web-stick-client.component.html'
})
export class WebStickClientComponent implements OnInit {

  @Output() public onMove = new EventEmitter<ApiMethod>();

  public ngOnInit() {
  }

  public sendMsg(content: string) {
    this.onMove.emit({
      payload: {content},
      type: 'message'
    });
  }

  public sendClear() {

  }
}
