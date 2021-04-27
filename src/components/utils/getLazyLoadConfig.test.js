/* eslint-disable max-len */
import { config, DIV_ID_FOO } from '../../utils/testAdvertisingConfig';
import getLazyLoadConfig from './getLazyLoadConfig';

test.each`
  inputDesc                                                                                            | expectedDesc                     | input                                                                                                                     | id            | expected
  ${'there is no config'}                                                                              | ${'null'}                        | ${undefined}                                                                                                              | ${DIV_ID_FOO} | ${null}
  ${'there is no slot config'}                                                                         | ${'null'}                        | ${{}}                                                                                                                     | ${DIV_ID_FOO} | ${null}
  ${'there is no slot config for the specified id'}                                                    | ${'null'}                        | ${config}                                                                                                                 | ${'blam'}     | ${null}
  ${'the lazy load config for the specified slot is null and there is no global lazy load config'}     | ${'null'}                        | ${{ slots: [{ id: DIV_ID_FOO, enableLazyLoad: null }] }}                                                                  | ${DIV_ID_FOO} | ${null}
  ${'the lazy load config of the specified slot is null'}                                              | ${'the global lazy load config'} | ${{ enableLazyLoad: 'my-global-lazy-load-config', slots: [{ id: DIV_ID_FOO, enableLazyLoad: null }] }}                    | ${DIV_ID_FOO} | ${'my-global-lazy-load-config'}
  ${'the specified slot has no lazy load config and there is no global lazy load config'}              | ${'null'}                        | ${config}                                                                                                                 | ${DIV_ID_FOO} | ${null}
  ${'the specified slot has not lazy load config'}                                                     | ${'the global lazy load config'} | ${{ enableLazyLoad: 'my-global-lazy-load-config', slots: config.slots }}                                                  | ${DIV_ID_FOO} | ${'my-global-lazy-load-config'}
  ${'the specified slot has a lazy load config'}                                                       | ${"the slot's lazy load config"} | ${{ slots: [{ id: DIV_ID_FOO, enableLazyLoad: 'slot-lazy-load-config' }] }}                                               | ${DIV_ID_FOO} | ${'slot-lazy-load-config'}
  ${'the specified slot has a lazy load config and there is a global lazy load config'}                | ${"the slot's lazy load config"} | ${{ enableLazyLoad: 'my-global-lazy-load-config', slots: [{ id: DIV_ID_FOO, enableLazyLoad: 'slot-lazy-load-config' }] }} | ${DIV_ID_FOO} | ${'slot-lazy-load-config'}
  ${"the specified slot's lazy loading config is set to false"}                                        | ${'false'}                       | ${{ slots: [{ id: DIV_ID_FOO, enableLazyLoad: false }] }}                                                                 | ${DIV_ID_FOO} | ${false}
  ${"the specified slot's lazy loading config is set to false and there is a global lazy load config"} | ${'false'}                       | ${{ enableLazyLoad: 'my-global-lazy-load-config', slots: [{ id: DIV_ID_FOO, enableLazyLoad: false }] }}                   | ${DIV_ID_FOO} | ${false}
`('returns $expectedDesc when $inputDesc', ({ input, id, expected }) =>
  expect(getLazyLoadConfig(input, id)).toBe(expected)
);
