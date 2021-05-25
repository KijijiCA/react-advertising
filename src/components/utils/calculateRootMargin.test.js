import calculateRootMargin from './calculateRootMargin';
import isMobileDevice from './isMobileDevice';

jest.mock('./isMobileDevice');
window.innerHeight = 600;

test.each`
  marginPercent | isMobileDeviceValue | mobileScaling | expected
  ${undefined}  | ${false}            | ${undefined}  | ${undefined}
  ${0}          | ${false}            | ${undefined}  | ${undefined}
  ${50}         | ${false}            | ${undefined}  | ${'300px'}
  ${100}        | ${false}            | ${undefined}  | ${'600px'}
  ${50}         | ${true}             | ${undefined}  | ${'300px'}
  ${50}         | ${true}             | ${-1}         | ${'300px'}
  ${50}         | ${true}             | ${1}          | ${'300px'}
  ${50}         | ${true}             | ${2}          | ${'600px'}
`(
  'returns $expected when called with margin percentage $marginPercent, ' +
    'is mobile device $isMobileDeviceValue, mobile scaling $mobileScaling',
  ({ marginPercent, isMobileDeviceValue, mobileScaling, expected }) => {
    isMobileDevice.mockReturnValue(isMobileDeviceValue);
    expect(calculateRootMargin({ marginPercent, mobileScaling })).toBe(
      expected
    );
  }
);
