import {Component, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {PARAM_GAME_URL} from '../app-routing.params';
import {WebStickClientComponent} from '../games/web-stick/client/web-stick-client.component';
import {WebStickHostComponent} from '../games/web-stick/host/web-stick-host.component';
import {MenuGameEntry} from '../menu-games/MenuGameEntry';
import {GameService} from './game.service';

@Component({
  selector: 'app-game',
  styleUrls: ['./game.component.css'],
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {

  public hostname: string;
  public password: string;
  public nick: string;

  private game: MenuGameEntry;
  private error: string;
  private connected: boolean;

  private injectedComponent: ComponentRef<Component>;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  public async ngOnInit() {
    const gamePathUrl = this.route.snapshot.paramMap.get(PARAM_GAME_URL);
    this.game = null;
    const game = this.gameService.getGameByPath(gamePathUrl);
    if (game) {
      this.game = game;
      this.error = null;
      this.connected = false;
    } else {
      this.error = 'Error';
    }
  }

  public createHost(): void {
    // todo connect socket    const nick = 'bede_gral_w_gre_69';
    //     const hostname = 'najba'; // typed by user - name of room
    //     const password = 'dupa'; // typed by user - password to room
    //     const SERVER_URL = 'http://localhost:3000';
    //     const socket = io(SERVER_URL, {
    //         query: {roomId, nick},
    //         reconnection: false, //otherwise its hard to debug
    //     });
    // todo check params

    const socket = io(environment.socket.server, {
      query: {roomId: this.calculateRoomId(this.hostname, this.password), nick: this.nick},
      reconnection: environment.socket.host.reconnection,
    });

    this.connected = true;
    this.injectComponent(WebStickHostComponent);
    const hostComponent = this.injectedComponent.instance as WebStickHostComponent;
    hostComponent.onMove({payload: {content: 'YEAH BUTTON 1a'}, type: 'message'});
  }

  public joinHost(): void {
    const socket = io(environment.socket.server, {
      query: {roomId: this.calculateRoomId(this.hostname, this.password), nick: this.nick},
      reconnection: environment.socket.client.reconnection,
    });

    this.connected = true;
    this.injectComponent(WebStickClientComponent);
    const clientComponent = this.injectedComponent.instance as WebStickClientComponent;
    clientComponent.onMove.subscribe((data) => {
      console.log('yeah', data);
    });
  }

  public disconnectHost() {
    // todo disconnect socket
    this.connected = false;
    this.injectedComponent.destroy();
  }

  private injectComponent(componentType: Type<any>) {
    if (this.injectedComponent) {
      this.injectedComponent.destroy();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    this.injectedComponent = this.viewContainerRef.createComponent(factory);
    this.injectedComponent.changeDetectorRef.detectChanges();
  }

  private calculateRoomId(hostname: string, password: string): string {
    return hostname + password;
  }
}
