import React from 'react';
import { spy } from 'sinon';
import renderer from 'react-test-renderer';
import { AdvertisingSlotDiv } from './AdvertisingSlot';

const id = 'my-beautiful-id';
const className = 'large pink';
const styles = {
    color: 'hotpink',
    fontSize: '2em'
};

describe('The advertising slot component', () => {
    let mockConnectToAdServer;
    beforeEach(() => {
        jest.resetModules();
        mockConnectToAdServer = spy();
        jest.doMock('./utils/connectToAdServer', () => component => {
            mockConnectToAdServer(component);
            return component;
        });
        require('./AdvertisingSlot');
    });
    it('is connected to the ad server', () => void expect(mockConnectToAdServer).to.have.been.called);
});

describe('The div component wrapped by the advertising slot component', () => {
    describe('with just an ID', () => snapshotTest(<AdvertisingSlotDiv id={id} />));
    describe('with CSS classes', () => snapshotTest(<AdvertisingSlotDiv id={id} className={className} />));
    describe('with CSS styles', () => snapshotTest(<AdvertisingSlotDiv id={id} styles={styles} />));
    describe('with children', () =>
        snapshotTest(
            <AdvertisingSlotDiv id={id}>
                <h1>Hello!1!</h1>
            </AdvertisingSlotDiv>
        ));
});

function snapshotTest(component) {
    it('is rendered correctly', () => expect(renderer.create(component).toJSON()).toMatchSnapshot());
}
