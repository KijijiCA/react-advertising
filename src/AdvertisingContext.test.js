import { spy, match } from 'sinon';

const mockContext = 'mock context';

describe('When the AdvertisingContext module is loaded', () => {
  let mockCreateContext, AdvertisingContext;
  beforeEach(() => {
    mockCreateContext = spy();
    jest.doMock('react', () => ({
      createContext(...args) {
        mockCreateContext(...args);
        return mockContext;
      },
    }));
    AdvertisingContext = require('./AdvertisingContext').default;
  });
  it('it calls React.createContext with a function as default value', () =>
    void mockCreateContext.should.have.been.calledWith(match.func));
  describe('the exported context', () => {
    it('is the result of React.createContext', () =>
      void AdvertisingContext.should.equal(mockContext));
  });
  afterEach(() => jest.resetModules());
});
