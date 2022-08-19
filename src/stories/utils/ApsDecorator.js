/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect } from 'react';

export default function (Story) {
  const wrapper = useRef();
  useEffect(() => {

    if (!window.apstag) {
      console.log('inside !window.apstag')
      window.apstag = {
        init(...args) {
          q('i', ...args);
        },
        fetchBids(...args) {
          q('f', ...args);
        },
        setDisplayBids() {},
        targetingKeys() {
          return [];
        },
        _Q: [],
      };
      const script = document.createElement('script');
      script.async = true;
      script.src = '//c.amazon-adsystem.com/aax2/apstag.js';
      wrapper.current.appendChild(script);
    }
    function q(c, r) {
      window.apstag._Q.push([c, r]);
    }
  }, [wrapper]);
  return (
    <div ref={wrapper}>
      <Story />
    </div>
  );
}
