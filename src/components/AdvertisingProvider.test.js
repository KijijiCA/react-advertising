import React from 'react';
import expectSnapshot from '@mt-testutils/expect-snapshot';
import AdvertisingProvider from './AdvertisingProvider';
import { stub, spy } from 'sinon';
import { mount } from 'enzyme';
import { config } from '../utils/testAdvertisingConfig';

const mockActivate = spy();
const mockSetup = spy();
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
                mockSetup(...args);
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

        it('sets up only once', () => {
            provider.setProps({ config: { ...config } });

            mockSetup.should.have.been.calledOnce;
        });

        it('uses an AdvertisingContext.Provider to pass the activate method of the advertising module', () =>
            expect(mockValueSpy.firstCall.args[0]).toMatchSnapshot());

        afterEach(resetMocks);
    });

    describe('when config is loaded asynchronously', () => {
        let provider;
        beforeEach(() => {
            provider = mount(<AdvertisingProvider />);
            mockIsConfigReady.resetBehavior();
            mockIsConfigReady.returns(false);
        });

        it('constructs an Advertising module', () => {
            mockConstructor.should.have.been.called;
        });

        it('sets configuration and sets up the Advertising module', () => {
            provider.setProps({ config });

            mockSetConfig.should.have.been.calledWith(config);
            mockSetup.should.have.been.calledOnce;
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
