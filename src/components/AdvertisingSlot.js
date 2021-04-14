import PropTypes from 'prop-types';
import React, { useEffect, useRef, useContext, useMemo } from 'react';
import AdvertisingContext from '../AdvertisingContext';
import isLazyLoading from './utils/isLazyLoading';

function AdvertisingSlot({
  id,
  style,
  className,
  children,
  customEventHandlers,
}) {
  const observerRef = useRef(null);
  const containerDivRef = useRef();
  const { activate, getLazyLoadConfig } = useContext(AdvertisingContext);
  const lazyLoadConfig = getLazyLoadConfig(id);
  const isLazyLoadEnabled = useMemo(() => isLazyLoading(lazyLoadConfig), [
    lazyLoadConfig,
  ]);
  // eslint-disable-next-line no-console
  useEffect(() => {
    if (!isLazyLoadEnabled || observerRef.current) {
      return;
    }
    observerRef.current = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        activate(id, customEventHandlers);
        observerRef.current.unobserve(containerDivRef.current);
      }
    });
    observerRef.current.observe(containerDivRef.current);
  }, []); // PH_TODO: what about if “activate” changes?

  useEffect(() => {
    if (isLazyLoadEnabled) {
      return;
    }
    activate(id, customEventHandlers);
  }, [activate]);
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
