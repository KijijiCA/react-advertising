import isMobileDevice from './isMobileDevice';

describe('A device', () => {
  const originalUserAgent = global.navigator.userAgent;
  let userAgent = null;
  beforeAll(() => {
    Object.defineProperty(global.navigator, 'userAgent', {
      get() {
        return userAgent;
      },
    });
  });
  describe('that has navigator.maxTouchPoints 0', () => {
    it('is not a mobile device', () => {
      navigator.maxTouchPoints = 0;
      expect(isMobileDevice()).toBeFalsy();
    });
  });
  describe('that has navigator.maxTouchPoints 1', () => {
    it('is a mobile device', () => {
      navigator.maxTouchPoints = 1;
      expect(isMobileDevice()).toBeTruthy();
    });
  });
  describe('that does not have a navigator.maxTouchPoints property', () => {
    beforeAll(() => {
      delete navigator.maxTouchPoints;
    });
    describe('and has navigator.msMaxTouchPoints 0', () => {
      it('is a not mobile device', () => {
        navigator.msMaxTouchPoints = 0;
        expect(isMobileDevice()).toBeFalsy();
      });
    });
    describe('and has navigator.msMaxTouchPoints 1', () => {
      it('is a mobile device', () => {
        navigator.msMaxTouchPoints = 1;
        expect(isMobileDevice()).toBeTruthy();
      });
    });
    describe('and does not have a navigator.msMaxTouchPoints property', () => {
      beforeAll(() => {
        delete navigator.msMaxTouchPoints;
      });
      describe('and matches a (pointer:coarse) media query', () => {
        it('is a mobile device', () => {
          window.matchMedia = jest.fn().mockReturnValue({
            media: '(pointer:coarse)',
            matches: true,
          });
          expect(isMobileDevice()).toBeTruthy();
        });
      });
      describe('and does not match a (pointer:coarse) media query', () => {
        it('is not a mobile device', () => {
          window.matchMedia = jest.fn().mockReturnValue({
            media: '(pointer:coarse)',
            matches: false,
          });
          expect(isMobileDevice()).toBeFalsy();
        });
      });
      describe('and does not support the matchMedia API', () => {
        beforeAll(() => {
          delete window.matchMedia;
        });
        describe('and has a window.orientation property', () => {
          it('is a mobile device', () => {
            window.orientation = 'vertical';
            expect(isMobileDevice()).toBeTruthy();
          });
        });
        describe('and has no window.orientation property', () => {
          beforeAll(() => {
            delete window.orientation;
          });
          describe('and has a mobile phone user agent', () => {
            it('is a mobile device', () => {
              userAgent =
                'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 ' +
                '(KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
              expect(isMobileDevice()).toBeTruthy();
            });
          });
          describe('and has a tablet user agent', () => {
            it('is a mobile device', () => {
              userAgent =
                'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
                'CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1';
              expect(isMobileDevice()).toBeTruthy();
            });
          });
          describe('and has a desktop browser user agent', () => {
            it('is not a mobile device', () => {
              userAgent =
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0';
              expect(isMobileDevice()).toBeFalsy();
            });
          });
        });
      });
    });
  });
  afterAll(() => {
    userAgent = originalUserAgent;
  });
});
