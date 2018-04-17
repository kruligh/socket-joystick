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
    // todo check params
    // todo make HostComponent abstract

    const socket = io(environment.socket.server, {
      query: {
        game: 'WebStick',
        host: true,
        name: this.hostname,
        roomId: this.calculateRoomId(this.hostname, this.password),
      },
      reconnection: environment.socket.host.reconnection,
    });

    this.injectComponent(WebStickHostComponent);
    const hostComponent = this.injectedComponent.instance as WebStickHostComponent;
    socket.on('move', (data) => {
      hostComponent.onMove(JSON.parse(data));
    });

    socket.on('error', (data) => {
      console.error('err', data);
    });

    this.connected = true;
  }

  public joinHost(): void {
    const socket = io(environment.socket.server, {
      query: {
        game: 'WebStick',
        nick: this.nick,
        roomId: this.calculateRoomId(this.hostname, this.password),
      },
      reconnection: environment.socket.client.reconnection,
    });

    this.injectComponent(WebStickClientComponent);
    const clientComponent = this.injectedComponent.instance as WebStickClientComponent;
    clientComponent.onMove.subscribe((data) => {
      socket.emit('move', data);
    });
    this.connected = true;
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
