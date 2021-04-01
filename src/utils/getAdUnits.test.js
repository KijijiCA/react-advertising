import getAdUnits from './getAdUnits';
import { config } from './testAdvertisingConfig';

describe('When I get ad units from a given config', () => {
  let adUnits;
  beforeEach(() => (adUnits = getAdUnits(config.slots)));
  describe('the result', () =>
    void it('is correct', () => expect(adUnits).toMatchSnapshot()));
});
