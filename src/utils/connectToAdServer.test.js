import { sandbox } from 'sinon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToAdServer from './connectToAdServer';
import { mount } from 'enzyme';

const mySandbox = sandbox.create();
const mockActivate = mySandbox.spy();
const mockContext = {};

class MockProvider extends Component {
    getChildContext() {
        return {
            activate: (divId, collapseCallback) => {
                mockContext.collapseCallback = collapseCallback;
                return mockActivate(divId, collapseCallback);
            }
        };
    }

    render() {
        return <span id="wrapper">{this.props.children}</span>;
    }
}

MockProvider.childContextTypes = {
    activate: PropTypes.func
};

MockProvider.propTypes = {
    children: PropTypes.node
};

describe('[@mt-advertising/containers/connectToAdServer]', () => {
    describe('When I create a component that is connected to the ad server', () => {
        let MyPlacement;
        beforeEach(() => (MyPlacement = connectToAdServer(({ divId }) => <div id={divId} />)));

        describe('and the component is mounted', () => {
            let wrapper;
            beforeEach(
                () =>
                    (wrapper = mount(
                        <MockProvider>
                            <MyPlacement divId="bla" />
                        </MockProvider>
                    ))
            );
            describe('the render output', () =>
                it('is correct (contains the placement)', () => expect(wrapper.html()).toMatchSnapshot()));
            describe('the “activate” function provided by the wrapper around the component', () => {
                it('is called exactly once', () => void expect(mockActivate).to.have.been.calledOnce);
                it('is called with the correct arguments', () =>
                    void expect(mockActivate.firstCall.args).toMatchSnapshot());
            });
            describe('and I call the collapse callback function passed to the wrapper', () => {
                beforeEach(() => mockContext.collapseCallback());
                describe('the render output', () =>
                    it('is correct (contains not placement, because it is hidden now)', () =>
                        void expect(wrapper.html()).toMatchSnapshot()));
            });
        });
    });
    // https://github.com/sinonjs/sinon/issues/1712
    // Vanilla reset shows a warning!
    afterEach(() => mySandbox.resetHistory());
});
