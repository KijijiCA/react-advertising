import React from 'react';
import { spy } from 'sinon';
import expectSnapshot from '@mt-testutils/expect-snapshot';
import { mount } from 'enzyme';

const id = 'my-id';

describe('The advertising slot component', () => {
    let AdvertisingSlot, mockActivate;
    beforeEach(() => {
        mockActivate = spy();
        jest.mock('./utils/connectToAdServer', () => Component => props => (
            <Component {...props} activate={mockActivate} />
        ));
        AdvertisingSlot = require('./AdvertisingSlot').default;
    });
    it('renders correctly', () =>
        expectSnapshot(
            <AdvertisingSlot id={id} style={{ color: 'hotpink' }} className="my-class">
                <h1>hello</h1>
            </AdvertisingSlot>
        ));
    describe('when mounted', () => {
        beforeEach(() => mount(<AdvertisingSlot id={id} />));
        it('calls the activate function', () => void mockActivate.should.have.been.calledWith(id));
    });
    afterEach(() => jest.resetModules());
});
