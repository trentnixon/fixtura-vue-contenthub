import { useRoute } from "vue-router";

export function useGA() {
  const route = useRoute(); // Get current route to track page path

  function trackEvent(action, category, label, value = null) {
    console.log("trackEvent", action, category, label, value);

    // Ensure gtag is initialized before tracking
    if (window.$gtag) {
      window.$gtag.event(action, {
        event_category: category || null,
        event_label: label || null,
        value: value || null,
        page_path: route.fullPath || null, // Optionally track the page path
      });
    } else {
      console.warn("Google Analytics is not initialized");
    }
  }

  return {
    trackEvent,
  };
}
