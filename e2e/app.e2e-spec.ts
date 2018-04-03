import { TestDemoPage } from './app.po';

describe('test-demo App', function() {
  let page: TestDemoPage;

  beforeEach(() => {
    page = new TestDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
