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
    active: true,
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

describe('[@mt-advertising/containers/AdvertisingConfigPropType]', () => {
    describe('When I check the prop types for a config that has active set to false and no other config', () => {
        let result;
        beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { active: false } })));
        describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
    });
    describe('When I check the prop types for a config that has active set to true and no other config', () => {
        let result;
        beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { active: true } })));
        describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
    });
    describe('When I check the prop types for a config with active === true and other config set properly', () => {
        let result;
        beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config })));
        describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
    });
});
