import getAdUnits from './getAdUnits';
import { config } from './testAdvertisingConfig';

describe('[@mt-advertising/main/utils/getAdUnits]', () =>
    describe('When I get ad units from a given config', () => {
        describe('without size mappings', () => {
            let adUnits;
            beforeEach(() => (adUnits = getAdUnits(config.slot)));
            describe('the result', () => it('is correct', () => expect(adUnits).toMatchSnapshot()));
        });
        describe('with size mappings', () => {
            let adUnits;
            beforeEach(() => (adUnits = getAdUnits(config.slot, config.sizeMappings)));
            describe('the result', () => it('is correct', () => expect(adUnits).toMatchSnapshot()));
        });
    }));
