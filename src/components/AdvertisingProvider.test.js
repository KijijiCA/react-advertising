import React from 'react';
import expectSnapshot from '@mt-testutils/expect-snapshot';
import AdvertisingProvider from './AdvertisingProvider';
import { stub, spy } from 'sinon';
import { mount } from 'enzyme';
import config from '../utils/testAdvertisingConfig';

const mockActivate = spy();
const mockSetup = spy();
const mockTeardown = spy();
const mockConstructor = spy();
const mockValueSpy = spy();
const mockIsConfigReady = stub().returns(true);

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
        }
);

describe('The AdvertisingProvider component', () => {
    it('renders correctly', () =>
        expectSnapshot(
            <AdvertisingProvider config={config}>
                <h1>hello</h1>
            </AdvertisingProvider>
        ));

    describe('when mounted', () => {
        beforeEach(() => mount(<AdvertisingProvider config={config} />));
        it('constructs an Advertising module with the provided configuration', () =>
            void mockConstructor.should.have.been.calledWith(config));
        it('sets up the Advertising module', () => void mockSetup.should.have.been.called);
        it('uses an AdvertisingContext.Provider to pass the activate method of the advertising module', () =>
            expect(mockValueSpy.firstCall.args[0]).toMatchSnapshot());
        afterEach(resetMocks);
    });

    describe('when mounted with active = false', () => {
        beforeEach(() => mount(<AdvertisingProvider config={config} active={false} />));
        it('constructs an Advertising module with the provided configuration', () =>
            void mockConstructor.should.have.been.called);
        it('does not set up an Advertising module', () => void mockSetup.should.not.have.been.called);
        afterEach(resetMocks);
    });
});

function resetMocks() {
    mockConstructor.resetHistory();
    mockSetup.resetHistory();
    mockTeardown.resetHistory();
    mockActivate.resetHistory();
    mockValueSpy.resetHistory();
}
