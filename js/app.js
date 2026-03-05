/**
 * Main app: state, data loading, handlers, and composition of components.
 * Uses window.DateUtils, window.LeaderboardUtils, and window components.
 */
(function () {
  const { useState, useEffect } = React;
  const e = React.createElement;
  const DateUtils = window.DateUtils;
  const LeaderboardUtils = window.LeaderboardUtils;
  const { getTodayEST, getTodayLocal, getWeekRangeForOffset, getMonthRangeForOffset, formatDateRange, getGridNumberForDate, normalizeDateString } = DateUtils;
  const { isWeekday, getWeekdaysBetween, calculateStats, calculateLeaderboardStats, calculateLeaderboardStatsForPeriod } = LeaderboardUtils;

  function getLeaderboardPeriodLabel(leaderboardPeriod, leaderboardWeekOffset, leaderboardMonthOffset) {
    if (leaderboardPeriod === "all-time") return null;
    if (leaderboardPeriod === "weekly") {
      if (leaderboardWeekOffset === 0) return "This week";
      if (leaderboardWeekOffset === -1) return "Last week";
      return Math.abs(leaderboardWeekOffset) + " weeks ago";
    }
    if (leaderboardPeriod === "monthly") {
      const { startDate } = getMonthRangeForOffset(leaderboardMonthOffset);
      const [, m] = startDate.split("-");
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      if (leaderboardMonthOffset === 0) return "This month";
      const [y] = startDate.split("-");
      return monthNames[Number(m) - 1] + " " + y;
    }
    return null;
  }

  function getLeaderboardPeriodDateRange(leaderboardPeriod, leaderboardWeekOffset, leaderboardMonthOffset) {
    if (leaderboardPeriod === "all-time") return null;
    if (leaderboardPeriod === "weekly") {
      const { startDate, endDate } = getWeekRangeForOffset(leaderboardWeekOffset);
      return formatDateRange(startDate, endDate);
    }
    if (leaderboardPeriod === "monthly") {
      const { startDate, endDate } = getMonthRangeForOffset(leaderboardMonthOffset);
      return formatDateRange(startDate, endDate);
    }
    return null;
  }

  function ImmaculateGridTracker() {
    const [view, setView] = useState("leaderboard");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [players, setPlayers] = useState({});
    const [showAddScore, setShowAddScore] = useState(false);
    const [isTodaysScore, setIsTodaysScore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingScore, setEditingScore] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [newScore, setNewScore] = useState({
      name: "",
      date: (() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })(),
      score: "",
      imageFile: null,
    });
    const [playerImages, setPlayerImages] = useState({});
    const [viewingImage, setViewingImage] = useState(null);
    const [leaderboardPeriod, setLeaderboardPeriod] = useState("weekly");
    const [leaderboardWeekOffset, setLeaderboardWeekOffset] = useState(0);
    const [leaderboardMonthOffset, setLeaderboardMonthOffset] = useState(0);

    const loadData = async () => {
      setLoading(true);
      try {
        const scores = await window.storage.get();
        const playersObj = {};
        const imagesObj = {};
        scores.forEach((score) => {
          if (!playersObj[score.name]) playersObj[score.name] = {};
          const normalizedDate = normalizeDateString(score.date);
          playersObj[score.name][normalizedDate] = score.score;
          if (!imagesObj[score.name]) imagesObj[score.name] = {};
          if (score.imageUrl) imagesObj[score.name][normalizedDate] = score.imageUrl;
        });
        setPlayerImages(imagesObj);
        setPlayers(playersObj);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load data. Please check your Supabase credentials in storage.js");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadData();
    }, []);

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
      const existingScore = players[newScore.name]?.[newScore.date];
      if (existingScore && !confirm(`${newScore.name} already has a score for ${newScore.date}. Overwrite?`)) return;

      setSaving(true);
      try {
        const result = await window.storage.update(newScore.name, newScore.date, score);
        if (result.success) {
          const updatedPlayers = { ...players };
          if (!updatedPlayers[newScore.name]) updatedPlayers[newScore.name] = {};
          updatedPlayers[newScore.name][newScore.date] = score;
          setPlayers(updatedPlayers);

          if (newScore.imageFile) {
            const today = getTodayLocal();
            const isCurrentDay = newScore.date === today;
            const canUpload = await window.storage.manageImageStorage(newScore.name, newScore.date, score, isCurrentDay);
            if (canUpload.canUpload) {
              await window.storage.uploadImage(newScore.name, newScore.date, newScore.imageFile);
            } else {
              alert(canUpload.message || "Cannot upload image for this score.");
            }
          }
          await loadData();
          setNewScore({ name: "", date: getTodayLocal(), score: "", imageFile: null });
          setIsTodaysScore(false);
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

    const handleEditScore = (playerName, date, score, imageUrl) => {
      setEditingScore({ name: playerName, date, score, imageUrl });
      setShowEditModal(true);
    };

    const handleImageUpload = async (file) => {
      if (!editingScore) return;
      setUploadingImage(true);
      try {
        const today = getTodayLocal();
        const isCurrentDay = editingScore.date === today;
        const canUpload = await window.storage.manageImageStorage(editingScore.name, editingScore.date, editingScore.score, isCurrentDay);
        if (!canUpload.canUpload) {
          alert(canUpload.message || "Cannot upload image for this score.");
          setUploadingImage(false);
          return;
        }
        const result = await window.storage.uploadImage(editingScore.name, editingScore.date, file);
        if (result.success) {
          await loadData();
          setEditingScore({ ...editingScore, imageUrl: result.imageUrl });
          alert("Image uploaded successfully!");
        } else {
          alert("Failed to upload image: " + result.message);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    };

    const handleDeleteImage = async () => {
      if (!editingScore || !confirm("Delete this grid image?")) return;
      setUploadingImage(true);
      try {
        const result = await window.storage.deleteImage(editingScore.name, editingScore.date);
        if (result.success) {
          await loadData();
          setEditingScore({ ...editingScore, imageUrl: null });
          alert("Image deleted successfully!");
        } else {
          alert("Failed to delete image: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    };

    const handleUpdateScore = async () => {
      if (!editingScore) return;
      const score = parseInt(editingScore.score);
      if (isNaN(score) || score < 0 || score > 900) {
        alert("Score must be a number between 0 and 900");
        return;
      }
      setSaving(true);
      try {
        const result = await window.storage.update(editingScore.name, editingScore.date, score);
        if (result.success) {
          await loadData();
          setEditingScore({ ...editingScore, score: score });
          alert("Score updated successfully!");
        } else {
          alert("Failed to update score: " + result.message);
        }
      } catch (error) {
        console.error("Error updating score:", error);
        alert("Failed to update score. Please try again.");
      } finally {
        setSaving(false);
      }
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

    const getLeaderboard = () => {
      return Object.entries(players)
        .map(([name, scores]) => ({ name, ...calculateLeaderboardStats(scores) }))
        .filter((player) => player.gamesPlayed > 0)
        .sort((a, b) => a.average - b.average);
    };

    const getLeaderboardForPeriod = (period) => {
      if (period === "all-time") return getLeaderboard();
      const { startDate, endDate } =
        period === "weekly"
          ? getWeekRangeForOffset(leaderboardWeekOffset)
          : getMonthRangeForOffset(leaderboardMonthOffset);
      return Object.entries(players)
        .map(([name, scores]) => ({
          name,
          ...calculateLeaderboardStatsForPeriod(scores, startDate, endDate),
        }))
        .filter((player) => player.gamesPlayed > 0)
        .sort((a, b) => a.average - b.average);
    };

    const getPlayerHistory = (name) => {
      if (!players[name]) return [];
      const actualScores = Object.entries(players[name]).map(([date, score]) => ({
        date,
        score,
        imageUrl: playerImages[name]?.[date] || null,
        isAutoScored: false,
      }));
      const allDates = Object.keys(players[name]).filter(isWeekday);
      if (allDates.length > 0) {
        const firstDate = allDates.sort()[0];
        const yesterdayEST = DateUtils.getYesterdayEST();
        const endDate = firstDate <= yesterdayEST ? yesterdayEST : firstDate;
        const allWeekdays = getWeekdaysBetween(firstDate, endDate);
        const todayEST = getTodayEST();
        const missedWeekdays = allWeekdays
          .filter((date) => !players[name][date] && date < todayEST)
          .map((date) => ({ date, score: 900, imageUrl: null, isAutoScored: true }));
        const allScores = [...actualScores, ...missedWeekdays];
        return allScores.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return actualScores.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const getTodaysScores = () => {
      const today = getTodayEST();
      const todaysScores = [];
      Object.entries(players).forEach(([name, scores]) => {
        Object.entries(scores).forEach(([date, score]) => {
          if (date === today) {
            todaysScores.push({
              name,
              score,
              date,
              imageUrl: playerImages[name]?.[date] || null,
            });
          }
        });
      });
      return todaysScores.sort((a, b) => a.score - b.score);
    };

    const setLeaderboardPeriodAndReset = (period) => {
      setLeaderboardPeriod(period);
      setLeaderboardWeekOffset(0);
      setLeaderboardMonthOffset(0);
    };

    const leaderboard = getLeaderboardForPeriod(leaderboardPeriod);

    if (loading) {
      return e(
        "div",
        { className: "min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center" },
        e(
          "div",
          { className: "text-center" },
          e("div", { className: "text-2xl font-bold text-gray-800 mb-2" }, "Loading..."),
          e("div", { className: "text-gray-600" }, "Fetching scores from Supabase")
        )
      );
    }

    return e(
      "div",
      { className: "min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4" },
      e(
        "div",
        { className: "max-w-4xl mx-auto" },
        e(
          "div",
          { className: "bg-white rounded-lg shadow-lg p-6 mb-6" },
          e(window.Header, {
            view,
            loading,
            onRefresh: loadData,
            onAddTodaysScore: () => {
              setNewScore({ name: "", date: getTodayLocal(), score: "", imageFile: null });
              setIsTodaysScore(true);
              setShowAddScore(true);
            },
            onAddScore: () => {
              setNewScore({ name: "", date: getTodayLocal(), score: "", imageFile: null });
              setIsTodaysScore(false);
              setShowAddScore(true);
            },
            onBack: () => {
              setView("leaderboard");
              setSelectedPlayer(null);
            },
          }),

          saving &&
            e(
              "div",
              {
                className: "bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg mb-4",
              },
              "Saving to Supabase..."
            ),

          showAddScore &&
            e(window.AddScoreForm, {
              newScore,
              setNewScore,
              players,
              isTodaysScore,
              saving,
              onSave: handleAddScore,
              onCancel: () => {
                setShowAddScore(false);
                setIsTodaysScore(false);
                setNewScore({ name: "", date: getTodayLocal(), score: "", imageFile: null });
              },
            }),

          view === "leaderboard" &&
            e(window.TodaysScoresSection, {
              todaysScores: getTodaysScores(),
              todayGridNumber: getGridNumberForDate(getTodayEST()),
              todayFormatted: new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              periodLabel: getLeaderboardPeriodLabel(leaderboardPeriod, leaderboardWeekOffset, leaderboardMonthOffset),
              periodDateRange: getLeaderboardPeriodDateRange(leaderboardPeriod, leaderboardWeekOffset, leaderboardMonthOffset),
              leaderboardPeriod,
              onSetLeaderboardPeriod: setLeaderboardPeriodAndReset,
              leaderboardWeekOffset,
              leaderboardMonthOffset,
              onSetLeaderboardWeekOffset: setLeaderboardWeekOffset,
              onSetLeaderboardMonthOffset: setLeaderboardMonthOffset,
              onPlayerClick: (name) => {
                setSelectedPlayer(name);
                setView("player");
              },
              leaderboard,
              onViewImage: setViewingImage,
            }),

          view === "player" &&
            selectedPlayer &&
            players[selectedPlayer] &&
            e(window.PlayerView, {
              selectedPlayer,
              playerStats: calculateStats(players[selectedPlayer]),
              playerHistory: getPlayerHistory(selectedPlayer),
              getGridNumberForDate,
              onEditScore: handleEditScore,
              onViewImage: setViewingImage,
              onDeleteScore: deleteScore,
              saving,
            })
        ),

        showEditModal &&
          editingScore &&
          e(window.EditScoreModal, {
            editingScore,
            setEditingScore,
            onClose: () => setShowEditModal(false),
            onUpdateScore: handleUpdateScore,
            saving,
            onImageUpload: handleImageUpload,
            onDeleteImage: handleDeleteImage,
            uploadingImage,
            onViewImage: setViewingImage,
          }),

        viewingImage &&
          e(window.ImageViewerModal, {
            imageUrl: viewingImage,
            onClose: () => setViewingImage(null),
          }),

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
  }

  window.ImmaculateGridTracker = ImmaculateGridTracker;
})();
