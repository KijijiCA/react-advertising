import { Title, Description, Primary } from '@storybook/addon-docs/blocks';
import React from 'react';
import AdvertisingConfigPropType from '../components/utils/AdvertisingConfigPropType';
import { AdvertisingProvider, AdvertisingSlot } from '../index';
import { GptDecorator } from './utils';

export const DefaultStory = () => {
  const config = {
    slots: [
      {
        id: "div-slot",
        path: "/6355419/Travel/Europe",
        sizes: [[100, 100]]
      }
    ],
    interstitialSlot: {
      path: "/6355419/Travel/Europe/France/Paris"
    }
  };
  return (
    <AdvertisingProvider config={config}>
      <AdvertisingSlot id="div-slot" />
      <a id="link" href="https://www.example.com/">
        TRIGGER INTERSTITIAL
      </a>
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
This example is the simplest implementation of an interstitial ad, delivered by the Google Ad 
Manager, through Google Publisher Tag (GPT). see more information of the default implementation here:
https://developers.google.com/publisher-tag/samples/display-web-interstitial-ad

You can prevent specific links from triggering GPT-managed web interstials by adding a 
data-google-interstitial="false" attribute to the anchor element or any ancestor of the anchor element.

⚠️ **Please note** currently an interstitial is not working standalone, there must be a basic slot available that would be displayed.

⚠️ **Please note** an interstistial can only triggered in separate window, it doesn't work in an iframe....
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
