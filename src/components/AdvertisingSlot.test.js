import React from 'react';
import { render } from '@testing-library/react';
import AdvertisingSlot from './AdvertisingSlot';
import AdvertisingContext from '../AdvertisingContext';

const ID = 'my-id';
const mockActivate = jest.fn();
const mockGetLazyLoadConfig = jest.fn().mockReturnValue(false);

describe('The advertising slot component', () => {
  let slot, rerender;

  beforeEach(() => {
    jest.clearAllMocks();
    ({
      container: { firstChild: slot },
      rerender,
    } = render(
      <AdvertisingContext.Provider
        value={{
          activate: mockActivate,
          getLazyLoadConfig: mockGetLazyLoadConfig,
        }}
      >
        <AdvertisingSlot
          id={ID}
          style={{ color: 'hotpink' }}
          className="my-class"
        >
          <h1>hello</h1>
        </AdvertisingSlot>
      </AdvertisingContext.Provider>
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
    rerender(
      <AdvertisingContext.Provider
        value={{
          activate: newMockActivate,
          getLazyLoadConfig: mockGetLazyLoadConfig,
        }}
      >
        <AdvertisingSlot id={ID} />
      </AdvertisingContext.Provider>
    );

    setTimeout(() => {
      expect(newMockActivate).toHaveBeenCalledTimes(1);
      done();
    }, 0);
  });

  it('does not call the new activate function if the activate function does not change', (done) => {
    rerender(
      <AdvertisingContext.Provider
        value={{
          activate: mockActivate,
          getLazyLoadConfig: mockGetLazyLoadConfig,
        }}
      >
        <AdvertisingSlot id={ID} />
      </AdvertisingContext.Provider>
    );

    setTimeout(() => {
      expect(mockActivate).toHaveBeenCalledTimes(1);
      done();
    }, 0);
  });
});
