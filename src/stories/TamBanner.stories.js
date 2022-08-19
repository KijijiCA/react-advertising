import { Title, Description, Primary } from '@storybook/addon-docs/blocks';
import React from 'react';
import AdvertisingConfigPropType from '../components/utils/AdvertisingConfigPropType';
import { AdvertisingProvider, AdvertisingSlot } from '../index';
import { GptDecorator, ApsDecorator } from './utils';

export const DefaultStory = () => {
  const config = {
    useAPS: true,
    aps: {
      pubId: '5110',
      bidTimeout: 2e3,
      deals: true,
    },
    slots: [
      {
        id: 'banner-ad',
        path: '/5138/kij.ca.move/homepage',
        sizes: [[300, 250]],
        targeting: {
          pos: 'top',
          pt: 'Homepage',
        },
      },
    ],
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

DefaultStory.storyName = 'TAM Banner';

export default {
  title: 'TAM Banner',
  decorators: [GptDecorator, ApsDecorator],
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component: `
In this most basic example of them all, we show a medium rectangle banner
(320x200 pixels) delivered by the Google Ad Manager, through Google Publisher 
Tag (GPT).
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
