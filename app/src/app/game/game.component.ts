import {Component, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  private injectedComponent: ComponentRef<>;

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
    console.log(this.hostname, this.password);
    // todo connect socket
    this.connected = true;
    this.injectComponent(WebStickHostComponent);
  }

  public joinHost(): void {
    console.log(this.hostname, this.nick, this.password);
    // todo connect socket
    this.connected = true;
    this.injectComponent(WebStickClientComponent);
  }

  public disconnectHost() {
    // todo disconnect socket
    this.connected = false;
    this.injectedComponent.destroy();
  }

  private injectComponent(componentType: Type<>) {
    if (this.injectedComponent) {
      this.injectedComponent.destroy();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    this.injectedComponent = this.viewContainerRef.createComponent(factory);
    this.injectedComponent.changeDetectorRef.detectChanges();
  }
}
