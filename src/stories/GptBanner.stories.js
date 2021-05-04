import { Title, Description, Primary } from '@storybook/addon-docs/blocks';
import React, { useRef, useEffect } from 'react';
import AdvertisingConfigPropType from '../components/utils/AdvertisingConfigPropType';
import { AdvertisingProvider, AdvertisingSlot } from '../index';

export const DefaultStory = () => {
  const config = {
    slots: [
      {
        id: 'banner-ad',
        path: '/6355419/Travel/Europe/France/Paris',
        sizes: [[300, 250]],
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

DefaultStory.storyName = 'GPT Banner';

export default {
  title: 'GPT Banner',
  decorators: [
    (Story) => {
      window.googletag = { cmd: [] };
      const wrapper = useRef();
      useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = '//securepubads.g.doubleclick.net/tag/js/gpt.js';
        wrapper.current.appendChild(script);
      }, [wrapper]);
      return (
        <div ref={wrapper}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      // see https://github.com/storybookjs/storybook/issues/12022
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
