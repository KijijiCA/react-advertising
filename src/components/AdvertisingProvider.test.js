import React from 'react';
import expectSnapshot from '@mt-testutils/expect-snapshot';
import AdvertisingProvider from './AdvertisingProvider';
import { stub, spy } from 'sinon';
import { mount } from 'enzyme';
import { config } from '../utils/testAdvertisingConfig';

const mockActivate = spy();
const mockSetup = stub().returns(Promise.resolve());
const mockTeardown = spy();
const mockConstructor = spy();
const mockValueSpy = spy();
const mockIsConfigReady = stub().returns(true);
const mockSetConfig = spy();

jest.mock('../AdvertisingContext', () => ({
    // eslint-disable-next-line react/prop-types
    Provider({ value, children }) {
        mockValueSpy(value);
        return <div id="advertising-context-provider">{children}</div>;
    }
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
            setup(...args) {
                return mockSetup(...args);
            }
            teardown(...args) {
                mockTeardown(...args);
            }
            isConfigReady() {
                return mockIsConfigReady();
            }
            setConfig(...args) {
                mockSetConfig(...args);
            }
        }
);

/* eslint-disable no-unused-expressions */
describe('The AdvertisingProvider component', () => {
    it('renders correctly', () => {
        expectSnapshot(
            <AdvertisingProvider config={config}>
                <h1>hello</h1>
            </AdvertisingProvider>
        );
    });

    describe('when mounted', () => {
        let provider;
        beforeEach(() => {
            provider = mount(<AdvertisingProvider config={config} />);
        });

        it('constructs an Advertising module with the provided configuration', () => {
            mockConstructor.should.have.been.calledWith(config);
        });

        it('sets up the Advertising module', () => {
            mockSetup.should.have.been.called;
        });

        it('sets up only once even if config reference is changed but the content does not changed', () => {
            provider.setProps({ config: { ...config } });

            mockSetup.should.have.been.calledOnce;
        });

        it('sets up should be called if the config content is changed', done => {
            provider.setProps({ config: { ...config, path: 'global/ad/unit/path2' } });

            // setProps is a async operation
            setTimeout(() => {
                mockTeardown.should.have.been.calledOnce;
                mockSetup.should.have.been.calledTwice;
                done();
            }, 0);
        });

        it('create a new Advertising instance with a new config if the config is changed', done => {
            provider.setProps({ config: undefined });

            // setProps is a async operation
            setTimeout(() => {
                mockTeardown.should.have.been.calledOnce;
                mockConstructor.should.have.been.calledWith(undefined, undefined);
                done();
            }, 0);
        });

        it('sets up should not be called if the config content is changed but active is `false`', done => {
            provider.setProps({
                config: { ...config, path: 'global/ad/unit/path2' },
                active: false
            });

            // setProps is a async operation
            setTimeout(() => {
                mockSetup.should.have.been.calledOnce;
                done();
            }, 0);
        });

        it('does not setup if the config change to `undefined`', done => {
            provider.setProps({ config: undefined });
            mockIsConfigReady.resetBehavior();
            mockIsConfigReady.returns(false);

            // setProps is a async operation
            setTimeout(() => {
                mockTeardown.should.have.been.calledOnce;
                mockSetup.should.have.been.calledOnce;
                done();
            }, 0);
        });

        it('uses an AdvertisingContext.Provider to pass the activate method of the advertising module', () => {
            expect(mockValueSpy.firstCall.args[0]).toMatchSnapshot();
        });

        it('tears down the Advertising module', () => {
            provider.unmount();

            mockTeardown.should.have.been.calledOnce;
        });

        afterEach(resetMocks);
    });

    describe('when config is loaded asynchronously', () => {
        let provider;
        beforeEach(() => {
            mockIsConfigReady.resetBehavior();
            mockIsConfigReady.returns(false);

            provider = mount(<AdvertisingProvider />);
        });

        it('constructs an Advertising module', () => {
            mockConstructor.should.have.been.called;
        });

        it('sets configuration and sets up the Advertising module', () => {
            provider.setProps({ config });

            mockSetConfig.should.have.been.calledWith(config);
            mockSetup.should.have.been.calledOnce;
        });

        it('tears down the Advertising module', done => {
            provider.setProps({ config });
            provider.unmount();

            // setProps is a async operation
            setTimeout(() => {
                mockTeardown.should.have.been.calledOnce;
                done();
            }, 0);
        });

        it('does not tear down the Advertising module if the config is undefined', () => {
            provider.unmount();

            mockTeardown.should.not.have.been.calledOnce;
        });

        afterEach(resetMocks);
    });

    describe('when mounted with active = false', () => {
        beforeEach(() => {
            mount(<AdvertisingProvider config={config} active={false} />);
        });

        it('constructs an Advertising module with the provided configuration', () => {
            mockConstructor.should.have.been.called;
        });

        it('does not set up an Advertising module', () => {
            mockSetup.should.not.have.been.called;
        });

        afterEach(resetMocks);
    });
});

function resetMocks() {
    mockConstructor.resetHistory();
    mockSetup.resetHistory();
    mockTeardown.resetHistory();
    mockActivate.resetHistory();
    mockValueSpy.resetHistory();
    mockSetConfig.resetHistory();
}
