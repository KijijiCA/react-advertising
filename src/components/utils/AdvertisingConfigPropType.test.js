import checkPropTypes from 'check-prop-types';
import React from 'react';
import AdvertisingConfigPropType from './AdvertisingConfigPropType';

function MyComponent() {
    return <h1>Hello!</h1>;
}

MyComponent.propTypes = {
    config: AdvertisingConfigPropType
};

const config = {
    metaData: {
        adUnitPath: {
            path: '/ad/unit/path'
        },
        usdToEurRate: 1.1
    },
    prebid: {
        timeout: 666
    },
    slots: []
};

describe('When I check the prop types for a valid config with no slots', () => {
    let result;
    beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config })));
    describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
});
describe('When I check the prop types for a valud config with a valid slot', () => {
    let result;
    beforeEach(
        () =>
            (result = checkPropTypes(MyComponent.propTypes, {
                config: {
                    ...config,
                    slots: [
                        {
                            id: 'foo',
                            sizes: ['bar'],
                            prebid: [
                                {
                                    mediaTypes: {
                                        banner: {
                                            sizes: [[666]]
                                        }
                                    },
                                    bids: [
                                        {
                                            bidder: 'qux'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }))
    );
    describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
});
describe('When I check the prop types for a valud config with an invalid slot', () => {
    let result;
    beforeEach(
        () =>
            (result = checkPropTypes(MyComponent.propTypes, {
                config: {
                    ...config,
                    slots: {
                        bla: 'blub'
                    }
                }
            }))
    );
    describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
});
describe('When I check the prop types for an invalid config', () => {
    let result;
    beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { metaData: 'foo' } })));
    describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
});
