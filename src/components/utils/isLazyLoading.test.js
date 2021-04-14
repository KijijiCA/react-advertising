import isLazyLoading from './isLazyLoading';

test.each`
  lazyLoadConfig            | expected
  ${undefined}              | ${false}
  ${null}                   | ${false}
  ${true}                   | ${true}
  ${false}                  | ${false}
  ${{}}                     | ${true}
  ${{ marginPercent: 100 }} | ${true}
  ${{ marginPercent: 0 }}   | ${true}
  ${{ marginPercent: -1 }}  | ${false}
`(
  'returns $expected when called with lazy load config $lazyLoadConfig',
  ({ lazyLoadConfig, expected }) =>
    expect(isLazyLoading(lazyLoadConfig)).toBe(expected)
);
