import { Title, Description, Primary } from '@storybook/addon-docs/blocks';
import React from 'react';
import AdvertisingConfigPropType from '../components/utils/AdvertisingConfigPropType';
import { AdvertisingProvider, AdvertisingSlot } from '../index';
import { GptDecorator, Spacer, RowLayout } from './utils';

export const DefaultStory = () => {
  const config = {
    slots: [
      {
        id: 'gpt-ad01',
        path: '/6355419/Travel/Europe/France',
        sizes: [[728, 90]],
      },
      {
        id: 'gpt-ad02',
        path: '/6355419/Travel/Europe/Spain',
        sizes: [[728, 90]],
      },
      {
        id: 'gpt-ad03',
        path: '/6355419/Travel/Europe/Italy',
        sizes: [[728, 90]],
      },
      {
        id: 'gpt-ad04',
        path: '/6355419/Travel/Europe/Portugal',
        sizes: [[728, 90]],
      },
    ],
    enableLazyLoad: true,
    targeting: {
      test: 'lazyload',
    },
  };
  return (
    <AdvertisingProvider config={config}>
      <p>👇🏻 Scroll down to see lazy loaded ads</p>
      <RowLayout>
        <AdvertisingSlot id="gpt-ad01" />
        <Spacer height={150} />
        <AdvertisingSlot id="gpt-ad02" />
        <Spacer height={150} />
        <AdvertisingSlot id="gpt-ad03" />
        <Spacer height={150} />
        <AdvertisingSlot id="gpt-ad04" />
      </RowLayout>
    </AdvertisingProvider>
  );
};

DefaultStory.propTypes = {
  config: AdvertisingConfigPropType,
};

DefaultStory.storyName = 'GPT Lazy Loading';

export default {
  title: 'GPT Lazy Loading',
  decorators: [GptDecorator],
  parameters: {
    docs: {
      // see https://github.com/storybookjs/storybook/issues/12022
      source: { type: 'code' },
      description: {
        component: `
This example show how you can “lazy load” ads, i.e. the ad slots on a long page get only activated and filled with 
banners when they the user scrolls down the page and the ads are almost in the browser viewport. 
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
