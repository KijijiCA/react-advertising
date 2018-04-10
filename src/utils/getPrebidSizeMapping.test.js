import getPrebidSizeMapping from './getPrebidSizeMapping';

const correctSizeMappingName = 'foo';
const incorrectSizeMappingName = 'bar';
const sizeMappings = {
    foo: [
        {
            viewPortSize: [200, 300],
            sizes: 'sizes'
        },
        {
            viewPortSize: [100],
            sizes: 'sizes'
        }
    ]
};

describe('When I get a Prebid size mapping', () => {
    describe('and size mapping name is undefined', () => {
        let result;
        beforeEach(() => (result = getPrebidSizeMapping()));
        describe('the result', () => it('is null', () => expect(result).toBeNull()));
    });
    describe('with a size mapping name', () => {
        describe('and no size mappings', () => {
            let result;
            beforeEach(() => (result = getPrebidSizeMapping(correctSizeMappingName)));
            describe('the result', () => it('is null', () => expect(result).toBeNull()));
        });
        describe('and size mappings that contain the mapping with the name', () => {
            let result;
            beforeEach(() => (result = getPrebidSizeMapping(correctSizeMappingName, sizeMappings)));
            describe('the result', () => it('is correct', () => expect(result).toMatchSnapshot()));
        });
        describe('and size mappings that do not contain the mapping with the name', () => {
            let result;
            beforeEach(() => (result = getPrebidSizeMapping(incorrectSizeMappingName, sizeMappings)));
            describe('the result', () => it('is null', () => expect(result).toBeNull()));
        });
    });
});
