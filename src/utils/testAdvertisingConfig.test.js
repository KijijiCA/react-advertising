import { config } from './testAdvertisingConfig';

describe('The test advertising configuration for unit tests', () =>
  void it('is correct', () => expect(config).toMatchSnapshot()));
