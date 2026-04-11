/* ============================================================
   Fields of The World — Hero Globe
   MapLibre GL rotating Earth with live HUD coordinate readout
   ============================================================ */
(function () {
  function init() {
    if (typeof maplibregl === 'undefined') return;
    var el = document.getElementById('hero-globe');
    if (!el) return;

    var stage = el.closest('.hero-stage');

    var map;
    try {
      map = new maplibregl.Map({
        container: 'hero-globe',
        style: {
          version: 8,
          glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
          sources: {
            sat: {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: ''
            }
          },
          layers: [
            { id: 'sat', type: 'raster', source: 'sat' }
          ]
        },
        center: [12, 22],
        zoom: 1.25,
        pitch: 0,
        bearing: 0,
        interactive: false,
        attributionControl: false,
        renderWorldCopies: false,
        fadeDuration: 0
      });
    } catch (e) {
      return;
    }

    if (map.setProjection) {
      try { map.setProjection({ type: 'globe' }); } catch (e) { /* older ver */ }
    }

    if (stage) stage.classList.add('is-loading');

    map.on('load', function () {
      if (stage) {
        stage.classList.remove('is-loading');
        stage.classList.add('is-live');
      }
      requestAnimationFrame(tick);
    });

    // graceful degrade — if tiles fail, keep banner fallback behind globe
    map.on('error', function () { /* swallow */ });

    var lastTs = 0;
    function tick(ts) {
      if (!lastTs) lastTs = ts;
      var dt = ts - lastTs;
      lastTs = ts;
      var c = map.getCenter();
      var newLng = c.lng + (dt * 0.004);   // ~0.24°/s
      if (newLng > 180) newLng -= 360;
      if (newLng < -180) newLng += 360;
      map.jumpTo({ center: [newLng, c.lat] });
      requestAnimationFrame(tick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
