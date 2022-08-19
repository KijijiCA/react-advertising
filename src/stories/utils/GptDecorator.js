/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect } from 'react';

export default function (Story) {
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
}
