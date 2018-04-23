import {APP_BASE_HREF} from '@angular/common';
import {TestBed, TestModuleMetadata} from '@angular/core/testing';
import {appModuleConfig} from '../app/app.module';

declare const beforeEach: any;

const testAppModuleConfig: Partial<TestModuleMetadata> = {
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
};

function sumProperties(propertyName: string, items: any[]): any[] {
  return items.reduce((acc, item) => {
    if (item[propertyName]) {
      return [
        ...acc,
        ...(item[propertyName])
      ];
    } else {
      return acc;
    }
  }, []);
}

export function initTestBed(customModuleConfig: Partial<TestModuleMetadata>) {
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      {
        ...appModuleConfig,
        ...testAppModuleConfig,
        ...customModuleConfig,
        providers: sumProperties('providers', [appModuleConfig, testAppModuleConfig, customModuleConfig])
      } as TestModuleMetadata
    ).compileComponents();
  });
}
