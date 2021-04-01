import React from 'react';
import { render } from '@testing-library/react';
import AdvertisingSlot from './AdvertisingSlot';

jest.mock('./utils/connectToAdServer', () => (Component) => Component);

const ID = 'my-id';
const mockActivate = jest.fn();

describe('The advertising slot component', () => {
  let slot, rerender;

  beforeEach(() => {
    jest.clearAllMocks();
    ({
      container: { firstChild: slot },
      rerender,
    } = render(
      <AdvertisingSlot
        activate={mockActivate}
        id={ID}
        style={{ color: 'hotpink' }}
        className="my-class"
      >
        <h1>hello</h1>
      </AdvertisingSlot>
    ));
  });

  it('renders correctly', () => {
    expect(slot).toMatchSnapshot();
  });

  it('calls the activate function with the ID', () => {
    expect(mockActivate).toHaveBeenCalledWith(ID, expect.anything());
  });

  it('calls the activate function with a collapse callback', () => {
    expect(mockActivate).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Object)
    );
  });

  it('calls the new activate function if the new activate function changes', (done) => {
    const newMockActivate = jest.fn();
    rerender(<AdvertisingSlot activate={newMockActivate} id={ID} />);

    setTimeout(() => {
      expect(newMockActivate).toHaveBeenCalledTimes(1);
      done();
    }, 0);
  });

  it('does not call the new activate function if the activate function does not change', (done) => {
    rerender(<AdvertisingSlot activate={mockActivate} id={ID} />);

    setTimeout(() => {
      expect(mockActivate).toHaveBeenCalledTimes(1);
      done();
    }, 0);
  });
});
