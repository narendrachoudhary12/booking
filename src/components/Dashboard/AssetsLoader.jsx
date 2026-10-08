import { useEffect } from "react";

const AssetsLoader = () => {
  useEffect(() => {
    // ✅ CSS FILES
    const styles = [
      "https://cdn.jsdelivr.net/npm/@fontsource/source-sans-3@5.0.12/index.css",
      "https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.1/styles/overlayscrollbars.min.css",
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
      "/css/adminlte.css",
      "https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.css",
      "https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css",
    ];

    // ✅ JS FILES
    const scripts = [
      "https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.1/browser/overlayscrollbars.browser.es6.min.js",
      "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js",
      "/js/adminlte.js",
      "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js",
      "https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.min.js",
      "https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/js/jsvectormap.min.js",
      "https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/maps/world.js",
    ];

    // Load CSS
    styles.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Load JS sequentially (important)
    const loadScriptsSequentially = async () => {
      for (let src of scripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = false;
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }
      }

      // ✅ AFTER ALL SCRIPTS LOADED → RUN YOUR INLINE CODE

      // OverlayScrollbars
      const sidebarWrapper = document.querySelector(".sidebar-wrapper");
      if (sidebarWrapper && window.OverlayScrollbarsGlobal) {
        window.OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
          scrollbars: {
            theme: "os-theme-light",
            autoHide: "leave",
            clickScroll: true,
          },
        });
      }

      // Sortable
      if (window.Sortable) {
        const connectedSortables = document.querySelectorAll(".connectedSortable");
        connectedSortables.forEach((el) => {
          new window.Sortable(el, {
            group: "shared",
            handle: ".card-header",
          });
        });
      }

      // ApexCharts (Revenue)
      if (window.ApexCharts) {
        const chart = new window.ApexCharts(
          document.querySelector("#revenue-chart"),
          {
            series: [
              { name: "Digital Goods", data: [28, 48, 40, 19, 86, 27, 90] },
              { name: "Electronics", data: [65, 59, 80, 81, 56, 55, 40] },
            ],
            chart: { type: "area", height: 300 },
            colors: ["#0d6efd", "#20c997"],
            stroke: { curve: "smooth" },
          }
        );
        chart.render();
      }

      // Vector Map
      if (window.jsVectorMap) {
        new window.jsVectorMap({
          selector: "#world-map",
          map: "world",
        });
      }

      // Sparklines
      if (window.ApexCharts) {
        const sparklineData = [
          [1000, 1200, 920, 927, 931, 1027],
          [515, 519, 520, 522, 652, 810],
          [15, 19, 20, 22, 33, 27],
        ];

        ["#sparkline-1", "#sparkline-2", "#sparkline-3"].forEach((id, i) => {
          new window.ApexCharts(document.querySelector(id), {
            series: [{ data: sparklineData[i] }],
            chart: { type: "area", height: 50, sparkline: { enabled: true } },
          }).render();
        });
      }
    };

    loadScriptsSequentially();
  }, []);

  return null;
};

export default AssetsLoader;