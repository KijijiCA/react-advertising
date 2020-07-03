import checkPropTypes from 'check-prop-types';
import React from 'react';
import AdvertisingSlotConfigPropType from './AdvertisingSlotConfigPropType';

function MyComponent() {
    return <h1>Hello</h1>;
}

MyComponent.propTypes = {
    config: AdvertisingSlotConfigPropType,
};

const prebid = [
    {
        mediaTypes: {
            banner: {
                sizes: [[320, 240]],
            },
        },
        bids: [
            {
                bidder: 'my-precious-bidder',
                params: { bla: 'bla' },
            },
        ],
    },
];

describe('When I check the prop types for a valid slot config', () => {
    let result;
    beforeEach(
        () =>
            (result = checkPropTypes(MyComponent.propTypes, {
                config: {
                    id: 'my-precious-div-id',
                    path: '/my/nice/path666',
                    collapseEmptyDiv: [true, true],
                    targeting: { a: 666 },
                    sizes: ['fluid', [320, 240]],
                    sizeMappingName: 'fredbazgrault',
                    prebid,
                },
            }))
    );
    describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
});
describe('When I check the prop types for an invalid slot config', () => {
    let result;
    beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { crappy: 'much' } })));
    describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
});

describe('When I check the prop types for a valid slot config', () => {
    const testCases = [
        'fluid',
        [320, 50],
        [
            [320, 50],
            [300, 250],
        ],
        ['fluid', [320, 50], [300, 250]],
    ];
    for (const sizes of testCases) {
        describe(`with sizes ${sizes}`, () => {
            let result;
            beforeEach(
                () => (result = checkPropTypes(MyComponent.propTypes, { config: { id: 'bar', sizes, prebid } }))
            );
            describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
        });
    }
});

describe('When I check the prop types a slot config', () => {
    const testCases = [
        {
            labelAny: 'blub',
            expectToPass: false,
        },
        {
            labelAny: [],
            expectToPass: true,
        },
        {
            labelAny: ['blub'],
            expectToPass: true,
        },
        {
            labelAny: [666],
            expectToPass: false,
        },
    ];
    for (const { labelAny, expectToPass } of testCases) {
        describe(`with a prebid bids labelAny config ${labelAny}`, () => {
            let result;
            beforeEach(
                () =>
                    (result = checkPropTypes(MyComponent.propTypes, {
                        config: {
                            id: 'thud',
                            prebid: [
                                {
                                    mediaTypes: {
                                        banner: {
                                            sizes: [[320, 240]],
                                        },
                                    },
                                    bids: [
                                        {
                                            bidder: 'my-precious-bidder',
                                            labelAny,
                                        },
                                    ],
                                },
                            ],
                        },
                    }))
            );
            if (expectToPass) {
                describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
            } else {
                describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
            }
        });
    }
});

describe('When I check the prop types a slot config', () => {
    const testCases = [
        {
            labelAll: 'blub',
            expectToPass: false,
        },
        {
            labelAll: [],
            expectToPass: true,
        },
        {
            labelAll: ['blub'],
            expectToPass: true,
        },
        {
            labelAll: [666],
            expectToPass: false,
        },
    ];
    for (const { labelAll, expectToPass } of testCases) {
        describe(`with a prebid bids labelAll config ${labelAll}`, () => {
            let result;
            beforeEach(
                () =>
                    (result = checkPropTypes(MyComponent.propTypes, {
                        config: {
                            id: 'thud',
                            prebid: [
                                {
                                    mediaTypes: {
                                        banner: {
                                            sizes: [[320, 240]],
                                        },
                                    },
                                    bids: [
                                        {
                                            bidder: 'my-precious-bidder',
                                            labelAll,
                                        },
                                    ],
                                },
                            ],
                        },
                    }))
            );
            if (expectToPass) {
                describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
            } else {
                describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
            }
        });
    }
});
