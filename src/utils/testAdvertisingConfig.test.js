import { config } from './testAdvertisingConfig';

describe('[@mt-advertising/main/utils/testAdvertisingConfig]', () =>
    describe('The test advertising configuration for unit tests', () =>
        it('is correct', () => expect(config).toMatchSnapshot())));
