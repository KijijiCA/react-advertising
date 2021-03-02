import React from 'react';
import connectToAdServer from './connectToAdServer';
import expectSnapshot from '@mt-testutils/expect-snapshot';

jest.mock('../../AdvertisingContext', () => ({
  Consumer({ children }) {
    return children('activate');
  },
}));

describe('When I connect a component to the ad server', () => {
  let ConnectedComponent;
  beforeEach(
    () =>
      (ConnectedComponent = connectToAdServer((props) => <div {...props} />))
  );
  describe('the connected component', () =>
    it('renders correctly (activate prop is added, other props are proxied through)', () =>
      expectSnapshot(<ConnectedComponent foo="bar" />)));
});
