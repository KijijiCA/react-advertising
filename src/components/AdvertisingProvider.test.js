import React from 'react';
import { render } from '@testing-library/react';
import AdvertisingProvider from './AdvertisingProvider';
import { config } from '../utils/testAdvertisingConfig';

const mockActivate = jest.fn();
const mockSetup = jest.fn();
const mockTeardown = jest.fn();
const mockConstructor = jest.fn();
const mockValueSpy = jest.fn();
const mockIsConfigReady = jest.fn();
const mockSetConfig = jest.fn();
const mockGetLazyLoadConfig = jest.fn().mockReturnValue(false);

jest.mock('../AdvertisingContext', () => ({
  // eslint-disable-next-line react/prop-types
  Provider({ value, children }) {
    mockValueSpy(value);
    return <div id="advertising-context-provider">{children}</div>;
  },
}));

jest.mock(
  '../Advertising',
  () =>
    class {
      constructor(...args) {
        mockConstructor(...args);
      }
      activate(...args) {
        mockActivate(...args);
      }
      async setup(...args) {
        mockSetup(...args);
      }
      async teardown(...args) {
        mockTeardown(...args);
      }
      isConfigReady() {
        return mockIsConfigReady();
      }
      setConfig(...args) {
        mockSetConfig(...args);
      }
      getLazyLoadConfig(...args) {
        return mockGetLazyLoadConfig(...args);
      }
    }
);

/* eslint-disable no-unused-expressions */
describe('The AdvertisingProvider component', () => {
  describe('when provided a configuration from the start', () => {
    let provider, rerender, unmount;

    beforeEach(() => {
      jest.clearAllMocks();
      mockIsConfigReady.mockReturnValue(true);
      ({
        container: { firstChild: provider },
        rerender,
        unmount,
      } = render(
        <AdvertisingProvider config={config}>
          <h1>hello</h1>
        </AdvertisingProvider>
      ));
    });

    it('renders correctly', () => {
      expect(provider).toMatchSnapshot();
    });

    it('constructs an Advertising module with the provided configuration', () => {
      expect(mockConstructor).toHaveBeenCalledWith(
        config,
        undefined,
        undefined
      );
    });

    it('sets up the Advertising module', () => {
      expect(mockSetup).toHaveBeenCalled();
    });

    it('calls setup only once even if config reference is changed but the content has not changed', () => {
      rerender(<AdvertisingProvider config={{ ...config }} />);
      expect(mockSetup).toHaveBeenCalledTimes(1);
    });

    it('calls setup when the config content is changed', (done) => {
      rerender(
        <AdvertisingProvider
          config={{ ...config, path: 'global/ad/unit/path2' }}
        />
      );

      setTimeout(() => {
        expect(mockSetup).toHaveBeenCalledTimes(2);
        expect(mockTeardown).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('creates a new Advertising instance with a new config when the config is changed', (done) => {
      rerender(<AdvertisingProvider />);

      setTimeout(() => {
        expect(mockConstructor).toHaveBeenCalledWith(
          undefined,
          undefined,
          undefined
        );
        expect(mockTeardown).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('does not call setup if the config content is changed but active is `false`', (done) => {
      rerender(
        <AdvertisingProvider
          config={{ ...config, path: 'global/ad/unit/path2' }}
          active={false}
        />
      );

      setTimeout(() => {
        expect(mockSetup).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('does not call setup if the config changes to `undefined`', (done) => {
      mockIsConfigReady.mockReturnValueOnce(false);
      rerender(<AdvertisingProvider />);

      setTimeout(() => {
        expect(mockTeardown).toHaveBeenCalledTimes(0);
        expect(mockSetup).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it(
      'uses an AdvertisingContext.Provider to pass the activate method ' +
        'and ad config of the advertising module',
      () => {
        expect(mockValueSpy.mock.calls[0][0]).toMatchSnapshot();
      }
    );

    it.only('tears down the Advertising module when it unmounts', () => {
      unmount();
      expect(mockTeardown).toHaveBeenCalledTimes(1);
    });
  });

  describe('when config is loaded asynchronously and provided later', () => {
    let rerender, unmount;
    beforeEach(() => {
      jest.clearAllMocks();
      mockIsConfigReady.mockReturnValue(false);
      ({ rerender, unmount } = render(<AdvertisingProvider />));
    });

    it('constructs an Advertising module', () => {
      expect(mockConstructor).toHaveBeenCalled();
    });

    it('sets configuration and sets up the Advertising module', () => {
      rerender(<AdvertisingProvider config={config} />);

      expect(mockSetConfig).toHaveBeenCalledWith(config);
      expect(mockSetup).toHaveBeenCalledTimes(1);
    });

    it('tears down the Advertising module', (done) => {
      rerender(<AdvertisingProvider config={config} />);
      unmount();

      setTimeout(() => {
        expect(mockTeardown).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('does not tear down the Advertising module if the config is undefined', () => {
      unmount();

      expect(mockTeardown).toHaveBeenCalledTimes(0);
    });
  });

  describe('when mounted with active = false', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockIsConfigReady.mockReturnValue(true);
      render(<AdvertisingProvider config={config} active={false} />);
    });

    it('constructs an Advertising module with the provided configuration', () => {
      expect(mockConstructor).toHaveBeenCalledWith(
        config,
        undefined,
        undefined
      );
    });

    it('does not set up the Advertising module', () => {
      expect(mockSetup).toHaveBeenCalledTimes(0);
    });
  });
});
