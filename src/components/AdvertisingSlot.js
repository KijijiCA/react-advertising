import React, { useEffect, useRef } from 'react';
import connectToAdServer from './utils/connectToAdServer';
import PropTypes from 'prop-types';

function AdvertisingSlot({
  id,
  style,
  className,
  children,
  activate,
  customEventHandlers,
}) {
  const containerDivRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      console.log('[PH_LOG] activating', id); // PH_TODO
      return activate(id, customEventHandlers);
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
  activate: PropTypes.func.isRequired,
  customEventHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
};

AdvertisingSlot.defaultProps = {
  customEventHandlers: {},
};

export default connectToAdServer(AdvertisingSlot);
