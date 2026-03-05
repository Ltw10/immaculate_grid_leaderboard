/**
 * Entry point: mount the app into #root.
 */
(function () {
  const e = React.createElement;
  ReactDOM.render(
    e(window.ImmaculateGridTracker),
    document.getElementById("root")
  );
})();
