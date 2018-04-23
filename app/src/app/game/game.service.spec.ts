import {inject} from '@angular/core/testing';

import {initTestBed} from '../../test/helpers';
import {GameService} from './game.service';

describe('GameService', () => {
  initTestBed({providers: [GameService]});

  it('should be created', inject([GameService], (service: GameService) => {
    expect(service).toBeTruthy();
  }));
});
