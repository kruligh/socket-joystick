import {AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit} from '@angular/core';
// tslint:disable no-var-requires
// const GameMaker: any = require('../../../../assets/resource/WebStick.js');

declare const GameMaker_Init: () => void;

const GM_SCRIPT_SRC = 'assets/games/webstick/WebStick.js';

@Component({
  selector: 'app-webstick-host',
  styleUrls: ['./web-stick-host.component.css'],
  templateUrl: './web-stick-host.component.html'
})
export class WebStickHostComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  public ngOnInit(): void {
    const GMscript = document.createElement('script');
    GMscript.type = 'text/javascript';
    GMscript.src = GM_SCRIPT_SRC;
    this.elementRef.nativeElement.appendChild(GMscript);
  }

  public runGame(): void {
    GameMaker_Init();
  }
}
