import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { sandbox } from 'sinon';
import AdvertisingProvider from './AdvertisingProvider';

const mySandbox = sandbox.create();
const mockAdvertisingConstructor = mySandbox.spy();
const mockAdvertisingSetup = mySandbox.spy();
const mockAdvertisingTeardown = mySandbox.spy();
const mockAdvertisingActivate = mySandbox.spy();

jest.mock(
    '../Advertising',
    () =>
        class {
            constructor(...args) {
                mockAdvertisingConstructor(...args);
            }

            setup(...args) {
                mockAdvertisingSetup(...args);
            }

            teardown(...args) {
                mockAdvertisingTeardown(...args);
            }

            activate(...args) {
                mockAdvertisingActivate(...args);
            }
        }
);

class FakePlacement extends Component {
    componentDidMount() {
        this.context.activate('fred');
    }
    render() {
        return <div />;
    }
}

FakePlacement.contextTypes = {
    activate: PropTypes.func.isRequired
};

const baseConfig = {
    metaData: {
        adUnitPath: {
            path: '/ad/unit/path'
        },
        usdToEurRate: 1.1
    },
    prebid: {
        timeout: 666
    },
    slot: {}
};

describe('When I render a placement provider component with some placement in it', () => {
    describe('with advertising configured to be active', () => {
        let wrapper, config;
        beforeEach(() => {
            config = { active: true, ...baseConfig };
            wrapper = mount(
                <AdvertisingProvider config={config}>
                    <FakePlacement />
                </AdvertisingProvider>
            );
        });
        describe('an instance of the main advertising module', () =>
            it('is created with the provided configuration', () =>
                void expect(mockAdvertisingConstructor).to.have.been.calledWith(config)));
        describe('the setup method of the main advertising module instance', () =>
            it('is called', () => void expect(mockAdvertisingSetup).to.have.been.calledOnce));
        describe('the activate method of the main advertising module instance', () =>
            it('is called by the placement child component', () =>
                void expect(mockAdvertisingActivate).to.have.been.calledWith('fred')));
        describe('and the component is unmounted', () => {
            beforeEach(() => wrapper.unmount());
            describe('the teardown method of the main advertising module instance', () =>
                it('is called', () => void expect(mockAdvertisingTeardown).to.have.been.calledOnce));
        });
    });
    describe('with advertising configured to be active', () => {
        let wrapper, config;
        beforeEach(() => {
            config = { active: false, ...baseConfig };
            wrapper = mount(
                <AdvertisingProvider config={config}>
                    <FakePlacement />
                </AdvertisingProvider>
            );
        });
        describe('an instance of the main advertising module', () =>
            it('is not created', () => void expect(mockAdvertisingConstructor).to.not.have.been.called));
        describe('the setup method of the main advertising module instance', () =>
            it('is not called', () => void expect(mockAdvertisingSetup).to.not.have.been.called));
        describe('the activate method of the main advertising module instance', () =>
            it('is not called by the placement child component', () =>
                void expect(mockAdvertisingActivate).to.not.have.been.called));
        describe('and the component is unmounted', () => {
            beforeEach(() => wrapper.unmount());
            describe('the teardown method of the main advertising module instance', () =>
                it('is not called', () => void expect(mockAdvertisingTeardown).to.not.have.been.called));
        });
    });
    // https://github.com/sinonjs/sinon/issues/1712
    // Vanilla reset shows a warning!
    afterEach(() => mySandbox.resetHistory());
});
