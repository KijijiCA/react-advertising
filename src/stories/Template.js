import React from 'react';
import AdvertisingConfigPropType from '../components/utils/AdvertisingConfigPropType';
import { AdvertisingProvider, AdvertisingSlot } from '../index';

/**
 * Sack Zement, wie das stänkt!
 */
const Template = ({ config }) => (
  <AdvertisingProvider config={config}>
    <AdvertisingSlot id="banner-ad" />
  </AdvertisingProvider>
);

Template.propTypes = {
  /**
   * The configuration used in the example; see [documentation](https://github.com/eBayClassifiedsGroup/react-advertising/wiki/Configuration)
   */
  config: AdvertisingConfigPropType,
};

export default Template;
