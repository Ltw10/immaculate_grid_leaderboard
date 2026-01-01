// Main application component
const { useState, useEffect } = React;
const e = React.createElement;
const { Trophy, Plus, ArrowLeft, Calendar, TrendingDown, Hash, RefreshCw } =
  window.Icons;

const ImmaculateGridTracker = () => {
  const [view, setView] = useState("leaderboard");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState({});
  const [showAddScore, setShowAddScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newScore, setNewScore] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    score: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const scores = await window.storage.get();

      // Convert array of scores to players object
      const playersObj = {};
      scores.forEach((score) => {
        if (!playersObj[score.name]) {
          playersObj[score.name] = {};
        }
        playersObj[score.name][score.date] = score.score;
      });

      console.log("Data loaded:", playersObj);
      setPlayers(playersObj);
    } catch (error) {
      console.error("Error loading data:", error);
      alert(
        "Failed to load data. Please check your Supabase credentials in storage.js"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async () => {
    if (!newScore.name || !newScore.date || !newScore.score) {
      alert("Please fill in all fields");
      return;
    }

    const score = parseInt(newScore.score);
    if (isNaN(score) || score < 0 || score > 900) {
      alert("Score must be a number between 0 and 900");
      return;
    }

    // Check if score already exists
    const existingScore = players[newScore.name]?.[newScore.date];
    if (existingScore) {
      if (
        !confirm(
          `${newScore.name} already has a score for ${newScore.date}. Overwrite?`
        )
      ) {
        return;
      }
    }

    setSaving(true);
    try {
      const result = await window.storage.update(
        newScore.name,
        newScore.date,
        score
      );

      if (result.success) {
        // Update local state
        const updatedPlayers = { ...players };
        if (!updatedPlayers[newScore.name]) {
          updatedPlayers[newScore.name] = {};
        }
        updatedPlayers[newScore.name][newScore.date] = score;
        setPlayers(updatedPlayers);

        setNewScore({
          name: "",
          date: new Date().toISOString().split("T")[0],
          score: "",
        });
        setShowAddScore(false);
      } else {
        alert("Failed to save score: " + result.message);
      }
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Failed to save score. Please try again.");
    } finally {
      setSaving(false);
    }
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

  const deleteScore = async (playerName, date) => {
    if (!confirm(`Delete score for ${playerName} on ${date}?`)) return;

    setSaving(true);
    try {
      const result = await window.storage.delete(playerName, date);

      if (result.success) {
        const updatedPlayers = { ...players };
        delete updatedPlayers[playerName][date];

        if (Object.keys(updatedPlayers[playerName]).length === 0) {
          delete updatedPlayers[playerName];
          setView("leaderboard");
          setSelectedPlayer(null);
        }

        setPlayers(updatedPlayers);
      } else {
        alert("Failed to delete score: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting score:", error);
      alert("Failed to delete score. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const leaderboard = getLeaderboard();

  if (loading) {
    return e(
      "div",
      {
        className:
          "min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center",
      },
      e(
        "div",
        { className: "text-center" },
        e(
          "div",
          { className: "text-2xl font-bold text-gray-800 mb-2" },
          "Loading..."
        ),
        e(
          "div",
          { className: "text-gray-600" },
          "Fetching scores from Supabase"
        )
      )
    );
  }

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
          e(
            "div",
            { className: "flex gap-2" },
            view === "leaderboard" &&
              e(
                "button",
                {
                  onClick: loadData,
                  className:
                    "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                  disabled: loading,
                },
                e(RefreshCw, { className: "w-5 h-5" }),
                "Refresh"
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
          )
        ),

        saving &&
          e(
            "div",
            {
              className:
                "bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg mb-4",
            },
            "Saving to Supabase..."
          ),

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
                    disabled: saving,
                    className:
                      "flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50",
                  },
                  saving ? "Saving..." : "Save Score"
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
                    disabled: saving,
                    className:
                      "flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50",
                  },
                  "Cancel"
                )
              )
            )
          ),

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
          )
      ),

      e(
        "div",
        { className: "text-center text-sm text-gray-600" },
        e(
          "p",
          null,
          "Track your Immaculate Grid scores with friends! Data synced via Supabase."
        )
      )
    )
  );
};

console.log("Rendering app...");
ReactDOM.render(e(ImmaculateGridTracker), document.getElementById("root"));
console.log("App rendered successfully!");
