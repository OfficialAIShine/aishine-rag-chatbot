/**
 * Widget mode detection.
 *
 * The chatbot is served as a contained widget when ?mode=widget is in the URL.
 * Embed via: <iframe src="/chat?mode=widget" />
 *
 * Optional: Pass ?session_id=xxx for cross-origin session continuity.
 */
export function getWidgetMode() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'widget';
}