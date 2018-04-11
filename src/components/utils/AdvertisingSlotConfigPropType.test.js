import checkPropTypes from 'check-prop-types';
import React from 'react';
import AdvertisingSlotConfigPropType from './AdvertisingSlotConfigPropType';

function MyComponent() {
    return <h1>Hello</h1>;
}

MyComponent.propTypes = {
    config: AdvertisingSlotConfigPropType
};

describe('When I check the prop types for a valid slot config', () => {
    let result;
    beforeEach(
        () =>
            (result = checkPropTypes(MyComponent.propTypes, {
                config: {
                    id: 'my-precious-div-id',
                    targeting: { a: 666 },
                    sizes: ['fluid', [320, 240]],
                    prebid: [
                        {
                            sizes: [[320, 240]],
                            bids: [
                                {
                                    bidder: 'my-precious-bidder',
                                    params: { bla: 'bla' }
                                }
                            ]
                        }
                    ]
                }
            }))
    );
    describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
});
describe('When I check the prop types for an invalid slot config', () => {
    let result;
    beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { crappy: 'much' } })));
    describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
});
