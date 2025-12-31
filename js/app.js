// Main application component
const { useState, useEffect } = React;
const e = React.createElement;
const { Trophy, Plus, ArrowLeft, Calendar, TrendingDown, Hash } = window.Icons;

const ImmaculateGridTracker = () => {
  const [view, setView] = useState("leaderboard");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState({});
  const [showAddScore, setShowAddScore] = useState(false);
  const [newScore, setNewScore] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    score: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await window.storage.get("immaculate-grid-players");
      if (result && result.value) {
        setPlayers(JSON.parse(result.value));
      }
    } catch (error) {
      console.log("No existing data found");
    }
  };

  const saveData = async (data) => {
    try {
      await window.storage.set("immaculate-grid-players", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const handleAddScore = () => {
    if (!newScore.name || !newScore.date || !newScore.score) {
      alert("Please fill in all fields");
      return;
    }

    const score = parseInt(newScore.score);
    if (isNaN(score) || score < 0 || score > 900) {
      alert("Score must be a number between 0 and 900");
      return;
    }

    const updatedPlayers = { ...players };
    if (!updatedPlayers[newScore.name]) {
      updatedPlayers[newScore.name] = {};
    }

    if (updatedPlayers[newScore.name][newScore.date]) {
      if (
        !confirm(
          `${newScore.name} already has a score for ${newScore.date}. Overwrite?`
        )
      ) {
        return;
      }
    }

    updatedPlayers[newScore.name][newScore.date] = score;
    setPlayers(updatedPlayers);
    saveData(updatedPlayers);

    setNewScore({
      name: "",
      date: new Date().toISOString().split("T")[0],
      score: "",
    });
    setShowAddScore(false);
  };

  const calculateStats = (playerScores) => {
    const scores = Object.values(playerScores);
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = scores.length > 0 ? (total / scores.length).toFixed(2) : 0;
    const gamesPlayed = scores.length;
    return { average: parseFloat(average), gamesPlayed, total };
  };

  const getLeaderboard = () => {
    return Object.entries(players)
      .map(([name, scores]) => ({
        name,
        ...calculateStats(scores),
      }))
      .sort((a, b) => a.average - b.average);
  };

  const getPlayerHistory = (name) => {
    if (!players[name]) return [];
    return Object.entries(players[name])
      .map(([date, score]) => ({ date, score }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const deleteScore = (playerName, date) => {
    if (!confirm(`Delete score for ${playerName} on ${date}?`)) return;

    const updatedPlayers = { ...players };
    delete updatedPlayers[playerName][date];

    if (Object.keys(updatedPlayers[playerName]).length === 0) {
      delete updatedPlayers[playerName];
      setView("leaderboard");
      setSelectedPlayer(null);
    }

    setPlayers(updatedPlayers);
    saveData(updatedPlayers);
  };

  const leaderboard = getLeaderboard();

  return e(
    "div",
    {
      className: "min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4",
    },
    e(
      "div",
      { className: "max-w-4xl mx-auto" },
      e(
        "div",
        { className: "bg-white rounded-lg shadow-lg p-6 mb-6" },
        // Header
        e(
          "div",
          { className: "flex items-center justify-between mb-6" },
          e(
            "div",
            { className: "flex items-center gap-3" },
            e(Trophy, { className: "w-8 h-8 text-orange-500" }),
            e(
              "h1",
              { className: "text-3xl font-bold text-gray-800" },
              "Immaculate Grid Tracker"
            )
          ),
          view === "leaderboard" &&
            e(
              "button",
              {
                onClick: () => setShowAddScore(true),
                className:
                  "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
              },
              e(Plus, { className: "w-5 h-5" }),
              "Add Score"
            ),
          view === "player" &&
            e(
              "button",
              {
                onClick: () => {
                  setView("leaderboard");
                  setSelectedPlayer(null);
                },
                className:
                  "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
              },
              e(ArrowLeft, { className: "w-5 h-5" }),
              "Back"
            )
        ),

        // Add Score Form
        showAddScore &&
          e(
            "div",
            {
              className:
                "bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200",
            },
            e(
              "h2",
              { className: "text-xl font-bold mb-4 text-gray-800" },
              "Add New Score"
            ),
            e(
              "div",
              { className: "grid gap-4" },
              e(
                "div",
                null,
                e(
                  "label",
                  { className: "block text-sm font-medium text-gray-700 mb-1" },
                  "Player Name"
                ),
                e("input", {
                  type: "text",
                  value: newScore.name,
                  onChange: (ev) =>
                    setNewScore({ ...newScore, name: ev.target.value }),
                  placeholder: "Enter name",
                  className:
                    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                  list: "player-names",
                }),
                e(
                  "datalist",
                  { id: "player-names" },
                  Object.keys(players).map((name) =>
                    e("option", { key: name, value: name })
                  )
                )
              ),
              e(
                "div",
                null,
                e(
                  "label",
                  { className: "block text-sm font-medium text-gray-700 mb-1" },
                  "Date"
                ),
                e("input", {
                  type: "date",
                  value: newScore.date,
                  onChange: (ev) =>
                    setNewScore({ ...newScore, date: ev.target.value }),
                  className:
                    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                })
              ),
              e(
                "div",
                null,
                e(
                  "label",
                  { className: "block text-sm font-medium text-gray-700 mb-1" },
                  "Score (0-900)"
                ),
                e("input", {
                  type: "number",
                  min: "0",
                  max: "900",
                  value: newScore.score,
                  onChange: (ev) =>
                    setNewScore({ ...newScore, score: ev.target.value }),
                  placeholder: "Enter score",
                  className:
                    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                })
              ),
              e(
                "div",
                { className: "flex gap-2" },
                e(
                  "button",
                  {
                    onClick: handleAddScore,
                    className:
                      "flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors",
                  },
                  "Save Score"
                ),
                e(
                  "button",
                  {
                    onClick: () => {
                      setShowAddScore(false);
                      setNewScore({
                        name: "",
                        date: new Date().toISOString().split("T")[0],
                        score: "",
                      });
                    },
                    className:
                      "flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors",
                  },
                  "Cancel"
                )
              )
            )
          ),

        // Leaderboard View
        view === "leaderboard" &&
          e(
            "div",
            null,
            e(
              "h2",
              { className: "text-2xl font-bold mb-4 text-gray-800" },
              "Leaderboard"
            ),
            leaderboard.length === 0
              ? e(
                  "div",
                  { className: "text-center py-12 text-gray-500" },
                  e(Trophy, { className: "w-16 h-16 mx-auto mb-4 opacity-30" }),
                  e(
                    "p",
                    { className: "text-lg" },
                    "No scores yet. Add your first score to get started!"
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
                        onClick: () => {
                          setSelectedPlayer(player.name);
                          setView("player");
                        },
                        className:
                          "bg-gradient-to-r from-white to-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all hover:shadow-md",
                      },
                      e(
                        "div",
                        { className: "flex items-center justify-between" },
                        e(
                          "div",
                          { className: "flex items-center gap-4" },
                          e(
                            "div",
                            {
                              className: `text-2xl font-bold ${
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
                            null,
                            e(
                              "h3",
                              { className: "text-lg font-bold text-gray-800" },
                              player.name
                            ),
                            e(
                              "div",
                              { className: "flex gap-4 text-sm text-gray-600" },
                              e(
                                "span",
                                { className: "flex items-center gap-1" },
                                e(TrendingDown, { className: "w-4 h-4" }),
                                `Avg: ${player.average}`
                              ),
                              e(
                                "span",
                                { className: "flex items-center gap-1" },
                                e(Hash, { className: "w-4 h-4" }),
                                `Games: ${player.gamesPlayed}`
                              )
                            )
                          )
                        ),
                        e(
                          "div",
                          { className: "text-right" },
                          e(
                            "div",
                            { className: "text-3xl font-bold text-orange-500" },
                            player.average
                          ),
                          e(
                            "div",
                            { className: "text-xs text-gray-500" },
                            "average"
                          )
                        )
                      )
                    )
                  )
                )
          ),

        // Player Detail View
        view === "player" &&
          selectedPlayer &&
          e(
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
                    calculateStats(players[selectedPlayer]).average
                  ),
                  e("div", { className: "text-sm text-gray-600" }, "Average")
                ),
                e(
                  "div",
                  null,
                  e(
                    "div",
                    { className: "text-2xl font-bold text-blue-500" },
                    calculateStats(players[selectedPlayer]).gamesPlayed
                  ),
                  e("div", { className: "text-sm text-gray-600" }, "Games")
                ),
                e(
                  "div",
                  null,
                  e(
                    "div",
                    { className: "text-2xl font-bold text-green-500" },
                    calculateStats(players[selectedPlayer]).total
                  ),
                  e("div", { className: "text-sm text-gray-600" }, "Total")
                )
              )
            ),
            e(
              "div",
              { className: "space-y-2" },
              getPlayerHistory(selectedPlayer).map(({ date, score }) =>
                e(
                  "div",
                  {
                    key: date,
                    className:
                      "flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors",
                  },
                  e(
                    "div",
                    { className: "flex items-center gap-3" },
                    e(Calendar, { className: "w-5 h-5 text-gray-400" }),
                    e(
                      "span",
                      { className: "font-medium text-gray-700" },
                      new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    )
                  ),
                  e(
                    "div",
                    { className: "flex items-center gap-3" },
                    e(
                      "span",
                      {
                        className: `text-xl font-bold ${
                          score <= 100
                            ? "text-green-500"
                            : score <= 300
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`,
                      },
                      score
                    ),
                    e(
                      "button",
                      {
                        onClick: () => deleteScore(selectedPlayer, date),
                        className:
                          "text-red-500 hover:text-red-700 text-sm font-medium",
                      },
                      "Delete"
                    )
                  )
                )
              )
            )
          )
      ),

      e(
        "div",
        { className: "text-center text-sm text-gray-600" },
        e(
          "p",
          null,
          "Track your Immaculate Grid scores and compete with friends!"
        )
      )
    )
  );
};

// Render the app
ReactDOM.render(e(ImmaculateGridTracker), document.getElementById("root"));
