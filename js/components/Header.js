/**
 * App header: title and action buttons (Refresh, Add Today's Score, Add Score, Back).
 */
(function () {
  const e = React.createElement;
  const { Trophy, Plus, ArrowLeft, Calendar, RefreshCw } = window.Icons;

  function Header(props) {
    const {
      view,
      loading,
      onRefresh,
      onAddTodaysScore,
      onAddScore,
      onBack,
    } = props;

    return e(
      "div",
      { className: "mb-6" },
      e(
        "div",
        { className: "flex items-center gap-3 mb-4 sm:mb-0" },
        e(Trophy, { className: "w-6 h-6 sm:w-8 sm:h-8 text-orange-500" }),
        e(
          "h1",
          {
            className:
              "text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800",
          },
          "Immaculate Grid Tracker"
        )
      ),
      e(
        "div",
        { className: "flex flex-wrap gap-2" },
        view === "leaderboard" &&
          e(
            "button",
            {
              onClick: onRefresh,
              className:
                "bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base",
              disabled: loading,
            },
            e(RefreshCw, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
            e("span", { className: "hidden sm:inline" }, "Refresh")
          ),
        view === "leaderboard" &&
          e(
            "button",
            {
              onClick: onAddTodaysScore,
              className:
                "bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base",
            },
            e(Calendar, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
            e(
              "span",
              { className: "hidden sm:inline" },
              "Add Today's Score"
            ),
            e("span", { className: "sm:hidden" }, "Today")
          ),
        view === "leaderboard" &&
          e(
            "button",
            {
              onClick: onAddScore,
              className:
                "bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base",
            },
            e(Plus, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
            e("span", { className: "hidden sm:inline" }, "Add Score"),
            e("span", { className: "sm:hidden" }, "Add")
          ),
        view === "player" &&
          e(
            "button",
            {
              onClick: onBack,
              className:
                "bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base",
            },
            e(ArrowLeft, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
            e("span", { className: "hidden sm:inline" }, "Back")
          )
      )
    );
  }

  window.Header = Header;
})();
