export default function getLazyLoadConfig(config, id) {
  if (!config?.slots) {
    return null;
  }
  const slotConfig = config.slots.find((slot) => slot.id === id);
  if (!slotConfig) {
    return null;
  }
  if (
    slotConfig.enableLazyLoad !== undefined &&
    slotConfig.enableLazyLoad !== null
  ) {
    return slotConfig.enableLazyLoad;
  }
  return config?.enableLazyLoad === undefined ? null : config?.enableLazyLoad;
}
