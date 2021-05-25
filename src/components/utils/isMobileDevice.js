// Mobile device detection, based on MDN solution:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
export default function isMobileDevice() {
  if ('maxTouchPoints' in navigator) {
    return navigator.maxTouchPoints > 0;
  }
  if ('msMaxTouchPoints' in navigator) {
    return navigator.msMaxTouchPoints > 0;
  }
  const mQ = window.matchMedia && matchMedia('(pointer:coarse)');
  if (mQ && mQ.media === '(pointer:coarse)') {
    return !!mQ.matches;
  }
  if ('orientation' in window) {
    return true; // deprecated, but good fallback
  }
  // Only as a last resort, fall back to user agent sniffing
  const UA = navigator.userAgent;
  return (
    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
  );
}
