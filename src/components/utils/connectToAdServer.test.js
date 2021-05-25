import { render } from '@testing-library/react';
import React from 'react';
import connectToAdServer from './connectToAdServer';

jest.mock('../../AdvertisingContext', () => ({
  Consumer({ children }) {
    return children({ activate: 'activate' });
  },
}));

describe('When I connect a component to the ad server', () => {
  let ConnectedComponent, connectedComponent;
  beforeEach(() => {
    ConnectedComponent = connectToAdServer((props) => <div {...props} />);
    ({
      container: { firstChild: connectedComponent },
    } = render(<ConnectedComponent foo="bar" />));
  });
  describe('the connected component', () =>
    void it('renders correctly (activate prop is added, other props are proxied through)', () =>
      expect(connectedComponent).toMatchSnapshot()));
});
