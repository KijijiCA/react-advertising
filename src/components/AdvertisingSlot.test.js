import React from 'react';
import { render } from '@testing-library/react';
import AdvertisingSlot from './AdvertisingSlot';
import AdvertisingContext from '../AdvertisingContext';
import { config, DIV_ID_FOO } from '../utils/testAdvertisingConfig';

const mockActivate = jest.fn();
const mockOnAdLoaded = jest.fn();

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
          config,
        }}
      >
        <AdvertisingSlot
          id={DIV_ID_FOO}
          style={{ color: 'hotpink' }}
          className="my-class"
          onAdLoaded={mockOnAdLoaded}
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
    expect(mockActivate).toHaveBeenCalledWith(
      DIV_ID_FOO,
      expect.anything(),
      mockOnAdLoaded
    );
  });

  it('calls the activate function with a collapse callback', () => {
    expect(mockActivate).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Object),
      mockOnAdLoaded
    );
  });

  it('calls the new activate function if the new activate function changes', (done) => {
    const newMockActivate = jest.fn();
    rerender(
      <AdvertisingContext.Provider
        value={{
          activate: newMockActivate,
          config,
        }}
      >
        <AdvertisingSlot id={DIV_ID_FOO} />
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
          config,
        }}
      >
        <AdvertisingSlot id={DIV_ID_FOO} />
      </AdvertisingContext.Provider>
    );

    setTimeout(() => {
      expect(mockActivate).toHaveBeenCalledTimes(1);
      done();
    }, 0);
  });

  it('calls the onAdLoaded function when ad is loaded', () => {
    mockOnAdLoaded(DIV_ID_FOO);

    expect(mockOnAdLoaded).toHaveBeenCalledTimes(1);
    expect(mockOnAdLoaded).toHaveBeenCalledWith(DIV_ID_FOO);
  });
});
