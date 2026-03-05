/**
 * Player detail view: stats and score history with edit/delete.
 */
(function () {
  const e = React.createElement;
  const { Calendar } = window.Icons;

  function PlayerView(props) {
    const {
      selectedPlayer,
      playerStats,
      playerHistory,
      getGridNumberForDate,
      onEditScore,
      onViewImage,
      onDeleteScore,
      saving,
    } = props;

    return e(
      "div",
      null,
      e(
        "h2",
        { className: "text-2xl font-bold mb-4 text-gray-800" },
        `${selectedPlayer}'s Scores`
      ),
      e(
        "div",
        { className: "bg-blue-50 p-4 rounded-lg mb-4" },
        e(
          "div",
          { className: "grid grid-cols-3 gap-4 text-center" },
          e(
            "div",
            null,
            e(
              "div",
              { className: "text-2xl font-bold text-orange-500" },
              playerStats.average
            ),
            e("div", { className: "text-sm text-gray-600" }, "Average")
          ),
          e(
            "div",
            null,
            e(
              "div",
              { className: "text-2xl font-bold text-blue-500" },
              playerStats.gamesPlayed
            ),
            e("div", { className: "text-sm text-gray-600" }, "Games")
          ),
          e(
            "div",
            null,
            e(
              "div",
              { className: "text-2xl font-bold text-green-500" },
              playerStats.total
            ),
            e("div", { className: "text-sm text-gray-600" }, "Total")
          )
        )
      ),
      e(
        "div",
        { className: "space-y-2" },
        playerHistory.map(
          ({ date, score, imageUrl, isAutoScored }) =>
            e(
              "div",
              {
                key: date,
                className: `flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isAutoScored
                    ? "bg-gray-100 border-gray-300 opacity-75 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:border-orange-300 cursor-pointer"
                }`,
                onClick: isAutoScored
                  ? undefined
                  : () => onEditScore(selectedPlayer, date, score, imageUrl),
              },
              e(
                "div",
                { className: "flex items-center gap-3" },
                e(Calendar, { className: "w-5 h-5 text-gray-400" }),
                e(
                  "div",
                  { className: "flex items-center gap-2 flex-wrap" },
                  e(
                    "span",
                    { className: "font-medium text-gray-700" },
                    new Date(date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  ),
                  e(
                    "span",
                    { className: "text-sm text-gray-500" },
                    "· #" + getGridNumberForDate(date)
                  ),
                  isAutoScored &&
                    e(
                      "span",
                      {
                        className:
                          "text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded",
                        title: "Auto-scored (missed day)",
                      },
                      "Missed"
                    )
                ),
                imageUrl &&
                  e(
                    "span",
                    {
                      className:
                        "text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200",
                      title: "Click to view image",
                      onClick: (ev) => {
                        ev.stopPropagation();
                        onViewImage(imageUrl);
                      },
                    },
                    "📷"
                  )
              ),
              e(
                "div",
                { className: "flex items-center gap-3" },
                e(
                  "div",
                  { className: "flex items-center gap-2" },
                  e(
                    "span",
                    {
                      className: `text-xl font-bold ${
                        isAutoScored
                          ? "text-gray-500 line-through"
                          : score <= 100
                          ? "text-green-500"
                          : score <= 300
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`,
                    },
                    score
                  ),
                  isAutoScored &&
                    e(
                      "span",
                      {
                        className: "text-xs text-gray-500 italic",
                        title: "Auto-scored 900 for missed weekday",
                      },
                      "(auto)"
                    )
                ),
                !isAutoScored &&
                  e(
                    "button",
                    {
                      onClick: (ev) => {
                        ev.stopPropagation();
                        onDeleteScore(selectedPlayer, date);
                      },
                      disabled: saving,
                      className:
                        "text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50",
                    },
                    "Delete"
                  )
              )
            )
        )
      )
    );
  }

  window.PlayerView = PlayerView;
})();
