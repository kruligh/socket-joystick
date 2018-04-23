import {AfterViewInit, Component} from '@angular/core';
import {ApiMethod} from '../web-stick.api';

@Component({
  selector: 'app-webstick-host',
  styleUrls: ['./web-stick-host.component.css'],
  templateUrl: './web-stick-host.component.html'
})
export class WebStickHostComponent implements AfterViewInit {

  private gmIframe: HTMLIFrameElement;
  private initialized = false;

  public ngAfterViewInit(): void {
    this.gmIframe = document.getElementById('game_iframe') as HTMLIFrameElement;
  }

  public runGame(): void {
    if (!this.initialized) {
      this.sendMessage({type: 'init', payload: {}});
    }
    this.initialized = true;
  }

  public onMove(msg: ApiMethod): void {
    console.log('yeah', msg);
  }

  private sendMessage(msg: ApiMethod): void {
    this.gmIframe.contentWindow.postMessage({
      data: msg.payload,
      gm: true,
      type: msg.type,
    }, '*'); // todo proably insecure?
  }
}
