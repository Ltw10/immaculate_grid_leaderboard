/**
 * Today's scores block and leaderboard section wrapper (period tabs + list).
 * Renders both "Today's Scores" and the "Leaderboard" heading + period controls.
 */
(function () {
  const e = React.createElement;
  const { Trophy, Calendar, TrendingDown, Hash } = window.Icons;

  function TodaysScoresSection(props) {
    const {
      todaysScores,
      todayGridNumber,
      todayFormatted,
      periodLabel,
      periodDateRange,
      leaderboardPeriod,
      onSetLeaderboardPeriod,
      leaderboardWeekOffset,
      leaderboardMonthOffset,
      onSetLeaderboardWeekOffset,
      onSetLeaderboardMonthOffset,
      onPlayerClick,
      leaderboard,
      onViewImage,
    } = props;

    return e(
      "div",
      null,
      e(
        "div",
        {
          className:
            "bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6 border-2 border-green-200",
        },
        e(
          "div",
          { className: "flex items-center justify-between mb-3 flex-wrap gap-2" },
          e(
            "h3",
            {
              className:
                "text-lg font-bold text-gray-800 flex items-center gap-2",
            },
            e(Calendar, { className: "w-5 h-5 text-green-600" }),
            "Today's Scores",
            e(
              "span",
              { className: "text-base font-semibold text-green-700" },
              "· Grid #" + todayGridNumber
            )
          ),
          e(
            "span",
            { className: "text-sm text-gray-600" },
            todayFormatted
          )
        ),
        todaysScores.length > 0
          ? e(
              "div",
              {
                className:
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
              },
              todaysScores.map(({ name, score, imageUrl }) =>
                e(
                  "div",
                  {
                    key: name,
                    className:
                      "bg-white p-3 rounded-lg border border-green-200 flex items-center justify-between",
                  },
                  e(
                    "div",
                    { className: "flex items-center gap-2" },
                    e(
                      "span",
                      { className: "font-medium text-gray-800" },
                      name
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
                    "span",
                    {
                      className: `text-lg font-bold ${
                        score <= 100
                          ? "text-green-600"
                          : score <= 300
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`,
                    },
                    score
                  )
                )
              )
            )
          : e(
              "div",
              { className: "text-center py-4 text-gray-500" },
              "No scores for today yet. Be the first to add one!"
            )
      ),
      e(
        "div",
        { className: "mb-4" },
        e(
          "h2",
          { className: "text-2xl font-bold text-gray-800 mb-2" },
          "Leaderboard"
        ),
        e(
          "div",
          { className: "flex flex-wrap gap-2 mb-2" },
          e(
            "button",
            {
              onClick: () => onSetLeaderboardPeriod("weekly"),
              className:
                leaderboardPeriod === "weekly"
                  ? "bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
                  : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300",
            },
            "Weekly"
          ),
          e(
            "button",
            {
              onClick: () => onSetLeaderboardPeriod("monthly"),
              className:
                leaderboardPeriod === "monthly"
                  ? "bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
                  : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300",
            },
            "Monthly"
          ),
          e(
            "button",
            {
              onClick: () => onSetLeaderboardPeriod("all-time"),
              className:
                leaderboardPeriod === "all-time"
                  ? "bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
                  : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300",
            },
            "All Time"
          )
        ),
        periodLabel &&
          e(
            "div",
            {
              className:
                "flex items-center gap-3 mb-2 flex-wrap",
            },
            e(
              "span",
              { className: "text-sm font-medium text-gray-700" },
              periodLabel
            ),
            periodDateRange &&
              e(
                "span",
                { className: "text-sm text-gray-500" },
                "(" + periodDateRange + ")"
              ),
            e(
              "button",
              {
                onClick: () =>
                  leaderboardPeriod === "weekly"
                    ? onSetLeaderboardWeekOffset((o) => o - 1)
                    : onSetLeaderboardMonthOffset((o) => o - 1),
                className:
                  "text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded",
              },
              "← Previous"
            ),
            e(
              "button",
              {
                onClick: () =>
                  leaderboardPeriod === "weekly"
                    ? onSetLeaderboardWeekOffset((o) => Math.min(0, o + 1))
                    : onSetLeaderboardMonthOffset((o) => Math.min(0, o + 1)),
                disabled:
                  (leaderboardPeriod === "weekly" &&
                    leaderboardWeekOffset === 0) ||
                  (leaderboardPeriod === "monthly" &&
                    leaderboardMonthOffset === 0),
                className:
                  "text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed",
              },
              "Next →"
            )
          ),
        e(
          "p",
          {
            className: "text-sm text-gray-600 italic",
          },
          "Note: Only weekday grids (Monday-Friday) count toward averages and games played."
        )
      ),
      leaderboard.length === 0
        ? e(
            "div",
            { className: "text-center py-12 text-gray-500" },
            e(Trophy, { className: "w-16 h-16 mx-auto mb-4 opacity-30" }),
            e(
              "p",
              { className: "text-lg" },
              leaderboardPeriod === "weekly"
                ? "No scores this week yet."
                : leaderboardPeriod === "monthly"
                ? "No scores this month yet."
                : "No scores yet. Add your first score to get started!"
            )
          )
        : e(
            "div",
            { className: "space-y-3" },
            leaderboard.map((player, index) =>
              e(
                "div",
                {
                  key: player.name,
                  onClick: () => onPlayerClick(player.name),
                  className:
                    "bg-gradient-to-r from-white to-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all hover:shadow-md",
                },
                e(
                  "div",
                  {
                    className:
                      "flex items-center justify-between gap-2 sm:gap-4",
                  },
                  e(
                    "div",
                    {
                      className:
                        "flex items-center gap-2 sm:gap-4 min-w-0 flex-1",
                    },
                    e(
                      "div",
                      {
                        className: `text-lg sm:text-2xl font-bold flex-shrink-0 ${
                          index === 0
                            ? "text-yellow-500"
                            : index === 1
                            ? "text-gray-400"
                            : index === 2
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`,
                      },
                      `#${index + 1}`
                    ),
                    e(
                      "div",
                      { className: "min-w-0 flex-1" },
                      e(
                        "h3",
                        {
                          className:
                            "text-base sm:text-lg font-bold text-gray-800 truncate",
                        },
                        player.name
                      ),
                      e(
                        "div",
                        {
                          className:
                            "flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600",
                        },
                        e(
                          "span",
                          { className: "flex items-center gap-1" },
                          e(TrendingDown, {
                            className: "w-3 h-3 sm:w-4 sm:h-4",
                          }),
                          `Avg: ${player.average}`
                        ),
                        e(
                          "span",
                          { className: "flex items-center gap-1" },
                          e(Hash, { className: "w-3 h-3 sm:w-4 sm:h-4" }),
                          e(
                            "span",
                            { className: "hidden sm:inline" },
                            "Weekday "
                          ),
                          `Games: ${player.gamesPlayed}`
                        ),
                        player.missedDays > 0 &&
                          e(
                            "span",
                            {
                              className:
                                "flex items-center gap-1 text-red-600 font-medium",
                              title:
                                "Missed weekday grids (auto-scored as 900)",
                            },
                            "⚠️",
                            e(
                              "span",
                              { className: "hidden sm:inline" },
                              "Missed: "
                            ),
                            player.missedDays
                          )
                      )
                    )
                  ),
                  e(
                    "div",
                    { className: "text-right flex-shrink-0" },
                    e(
                      "div",
                      {
                        className:
                          "text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500",
                      },
                      player.average
                    ),
                    e(
                      "div",
                      {
                        className:
                          "text-xs text-gray-500 hidden sm:block",
                      },
                      "average"
                    )
                  )
                )
              )
            )
          )
    );
  }

  window.TodaysScoresSection = TodaysScoresSection;
})();
