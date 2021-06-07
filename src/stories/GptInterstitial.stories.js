import { Title, Description, Primary } from '@storybook/addon-docs/blocks';
import React from 'react';
import AdvertisingConfigPropType from '../components/utils/AdvertisingConfigPropType';
import { AdvertisingProvider, AdvertisingSlot } from '../index';
import { GptDecorator } from './utils';

export const DefaultStory = () => {
  const config = {
    interstitialSlot: {
      path: '/4288/mobile.homepage/Mob_Interstitial',
      targeting: {
        a: 'm138',
        eagt: '1555325533',
      },
    },
  };
  return (
    <AdvertisingProvider config={config}>
      <AdvertisingSlot id="banner-ad" />
    </AdvertisingProvider>
  );
};

DefaultStory.propTypes = {
  config: AdvertisingConfigPropType,
};

DefaultStory.storyName = 'GPT Interstitial';

export default {
  title: 'GPT Interstitial',
  decorators: [GptDecorator],
  parameters: {
    docs: {
      // see https://github.com/storybookjs/storybook/issues/12022
      source: { type: 'code' },
      description: {
        component: `
In example of them all, we show an interstitial ad, delivered by the Google Ad 
Manager, through Google Publisher Tag (GPT).
        `,
      },
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
        </>
      ),
    },
  },
};
