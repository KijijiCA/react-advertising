const mockContext = 'mock context';

describe('When the AdvertisingContext module is loaded', () => {
  let mockCreateContext, AdvertisingContext;
  beforeEach(() => {
    mockCreateContext = jest.fn();
    jest.doMock('react', () => ({
      createContext(...args) {
        mockCreateContext(...args);
        return mockContext;
      },
    }));
    AdvertisingContext = require('./AdvertisingContext').default;
  });
  it('it calls React.createContext with a function as default value', () =>
    expect(mockCreateContext).toHaveBeenCalledWith(expect.any(Function)));
  describe('the exported context', () =>
    void it('is the result of React.createContext', () =>
      expect(AdvertisingContext).toStrictEqual(mockContext)));
  afterEach(() => jest.resetModules());
});
