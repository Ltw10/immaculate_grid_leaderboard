/**
 * Leaderboard calculation utilities (weekdays, missed days, period stats).
 * Depends on window.DateUtils
 */
(function () {
  const { getTodayEST, getYesterdayEST } = window.DateUtils;

  function isWeekday(dateString) {
    const date = new Date(dateString + "T00:00:00");
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  function getWeekdaysBetween(startDate, endDate) {
    const weekdays = [];
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      if (isWeekday(dateStr)) weekdays.push(dateStr);
      current.setDate(current.getDate() + 1);
    }
    return weekdays;
  }

  function calculateStats(playerScores) {
    const scores = Object.values(playerScores);
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average =
      scores.length > 0 ? (total / scores.length).toFixed(2) : 0;
    const gamesPlayed = scores.length;
    return { average: parseFloat(average), gamesPlayed, total };
  }

  function calculateLeaderboardStats(playerScores) {
    const weekdayScores = Object.entries(playerScores)
      .filter(([date]) => isWeekday(date))
      .map(([, score]) => score);
    if (weekdayScores.length === 0) {
      return { average: 0, gamesPlayed: 0, total: 0, missedDays: 0 };
    }
    const allDates = Object.keys(playerScores).filter(isWeekday);
    if (allDates.length === 0) {
      return { average: 0, gamesPlayed: 0, total: 0, missedDays: 0 };
    }
    const firstDate = allDates.sort()[0];
    const todayEST = getTodayEST();
    const yesterdayEST = getYesterdayEST();
    const endDate = firstDate <= yesterdayEST ? yesterdayEST : firstDate;
    const allWeekdays = getWeekdaysBetween(firstDate, endDate);
    const missedDays = allWeekdays.filter(
      (date) => !playerScores[date] && date < todayEST
    ).length;
    const totalWithMissed =
      weekdayScores.reduce((s, n) => s + n, 0) + missedDays * 900;
    const totalWeekdays = weekdayScores.length + missedDays;
    const average =
      totalWeekdays > 0 ? (totalWithMissed / totalWeekdays).toFixed(2) : 0;
    return {
      average: parseFloat(average),
      gamesPlayed: weekdayScores.length,
      total: totalWithMissed,
      missedDays,
    };
  }

  function calculateLeaderboardStatsForPeriod(
    playerScores,
    startDate,
    endDate
  ) {
    const todayEST = getTodayEST();
    const yesterdayEST = getYesterdayEST();
    const endForScores = endDate > todayEST ? todayEST : endDate;
    if (startDate > endForScores) {
      return { average: 0, gamesPlayed: 0, total: 0, missedDays: 0 };
    }
    const weekdayScores = Object.entries(playerScores)
      .filter(
        ([date]) =>
          isWeekday(date) && date >= startDate && date <= endForScores
      )
      .map(([, score]) => score);
    const endForMissed = endDate > yesterdayEST ? yesterdayEST : endDate;
    const allWeekdaysForMissed =
      startDate <= endForMissed
        ? getWeekdaysBetween(startDate, endForMissed)
        : [];
    const missedDays = allWeekdaysForMissed.filter(
      (date) => !playerScores[date]
    ).length;
    const totalWithMissed =
      weekdayScores.reduce((s, n) => s + n, 0) + missedDays * 900;
    const totalDays = weekdayScores.length + missedDays;
    const average =
      totalDays > 0 ? (totalWithMissed / totalDays).toFixed(2) : 0;
    return {
      average: parseFloat(average),
      gamesPlayed: weekdayScores.length,
      total: totalWithMissed,
      missedDays,
    };
  }

  window.LeaderboardUtils = {
    isWeekday,
    getWeekdaysBetween,
    calculateStats,
    calculateLeaderboardStats,
    calculateLeaderboardStatsForPeriod,
  };
})();
