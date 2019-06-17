import React from 'react';
import { spy, match } from 'sinon';
import expectSnapshot from '@mt-testutils/expect-snapshot';
import { mount } from 'enzyme';
import AdvertisingSlot from './AdvertisingSlot';

jest.mock('./utils/connectToAdServer', () => Component => Component);

describe('The advertising slot component', () => {
    const ID = 'my-id';
    const mockActivate = spy();
    beforeEach(() => {
        mockActivate.resetHistory();
    });

    it('renders correctly', () => {
        expectSnapshot(
            <AdvertisingSlot activate={mockActivate} id={ID} style={{ color: 'hotpink' }} className="my-class">
                <h1>hello</h1>
            </AdvertisingSlot>
        );
    });

    describe('when mounted', () => {
        let slot;
        beforeEach(() => {
            slot = mount(<AdvertisingSlot activate={mockActivate} id={ID} />);
        });

        it('calls the activate function with the ID', () => {
            mockActivate.should.have.been.calledWith(ID);
        });

        it('calls the activate function with a collapse callback', () => {
            mockActivate.should.have.been.calledWith(match.any, match.object);
        });

        it('calls the new activate function if the new activate function changes', done => {
            const newMockActivate = spy();
            slot.setProps({ activate: newMockActivate });

            // setProps is a async operation
            setTimeout(() => {
                // eslint-disable-next-line no-unused-expressions
                newMockActivate.should.has.been.calledOnce;
                done();
            }, 0);
        });

        it('does not call the new activate function if the activate function does not change', done => {
            slot.setProps({ activate: mockActivate });

            // setProps is a async operation
            setTimeout(() => {
                // eslint-disable-next-line no-unused-expressions
                mockActivate.should.has.been.calledOnce;
                done();
            }, 0);
        });
    });

    afterEach(() => jest.resetModules());
});
