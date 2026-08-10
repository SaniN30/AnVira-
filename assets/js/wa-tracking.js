/* Fires a Google Ads conversion event whenever a wa.me WhatsApp link is clicked.
   Delegated on document so it covers links rendered dynamically by data.js-driven cards. */
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"]');
    if (!link) return;

    gtag('event', 'conversion', {
      send_to: 'AW-18140671098',
      event_category: 'engagement',
      event_label: link.getAttribute('aria-label') || link.textContent.trim().slice(0, 100),
      page_path: window.location.pathname,
      property: document.body ? document.body.dataset.estate || '' : ''
    });
  }, true);
})();
