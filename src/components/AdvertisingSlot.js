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
  const observerRef = useRef(null);
  const containerDivRef = useRef();
  const activate = useContext(AdvertisingContext);
  useEffect(() => {
    if (observerRef.current) {
      return;
    }
    observerRef.current = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        activate(id, customEventHandlers);
        observerRef.current.unobserve(containerDivRef.current);
      }
    });
    observerRef.current.observe(containerDivRef.current);
  }, []);
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
