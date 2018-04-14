import { AppPage } from './app.po';

describe('joystick-app App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('HorizonDev feat Yeahbunny');
  });
});
