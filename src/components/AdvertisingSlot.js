import PropTypes from 'prop-types';
import React, { useEffect, useRef, useContext } from 'react';
import AdvertisingContext from '../AdvertisingContext';

function AdvertisingSlot({
  id,
  style,
  className,
  children,
  customEventHandlers,
}) {
  const containerDivRef = useRef();
  const activate = useContext(AdvertisingContext);
  useEffect(() => {
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        /* eslint-disable no-console */
        console.log(
          '%c🦄 [PH_LOG]',
          'font-size: 12px; color: white; background-color: purple; ' +
            'border-radius: 8px; padding: 2px 8px 2px 4px',
          'activating',
          id
        ); // PH_TODO
        /* eslint-enable no-console */
        activate(id, customEventHandlers);
        observer.unobserve(containerDivRef.current);
      }
    });
    observer.observe(containerDivRef.current);
  });
  return (
    <div
      id={id}
      style={style}
      className={className}
      children={children}
      ref={containerDivRef}
    />
  );
}

AdvertisingSlot.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  customEventHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
};

AdvertisingSlot.defaultProps = {
  customEventHandlers: {},
};

export default AdvertisingSlot;
