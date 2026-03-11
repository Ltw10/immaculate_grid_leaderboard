/**
 * Date and grid number utilities (EST timezone).
 * Attaches to window.DateUtils
 */
(function () {
  const GRID_REFERENCE_DATE = "2026-03-04";
  const GRID_REFERENCE_NUMBER = 954;

  function getTodayEST() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(now);
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    return `${year}-${month}-${day}`;
  }

  function getYesterdayEST() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(yesterday);
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    return `${year}-${month}-${day}`;
  }

  // Monday of the week that contains today (EST). So on Monday we get today; no previous week.
  function getWeekStartEST() {
    const today = getTodayEST();
    const [y, m, d] = today.split("-").map(Number);
    for (let offset = 0; offset < 7; offset++) {
      const checkDate = new Date(Date.UTC(y, m - 1, d - offset, 12, 0, 0));
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
      });
      if (formatter.format(checkDate) === "Mon") {
        const ys = String(checkDate.getUTCFullYear());
        const ms = String(checkDate.getUTCMonth() + 1).padStart(2, "0");
        const ds = String(checkDate.getUTCDate()).padStart(2, "0");
        return `${ys}-${ms}-${ds}`;
      }
    }
    return today;
  }

  function getMonthStartEST() {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const now = new Date();
    const parts = formatter.formatToParts(now);
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    return `${year}-${month}-01`;
  }

  function addDaysToDate(dateStr, days) {
    const d = new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getWeekRangeForOffset(weekOffset) {
    const thisWeekStart = getWeekStartEST();
    if (weekOffset === 0) {
      return { startDate: thisWeekStart, endDate: getTodayEST() };
    }
    const startDate = addDaysToDate(thisWeekStart, weekOffset * 7);
    const endDate = addDaysToDate(startDate, 6);
    return { startDate, endDate };
  }

  function getMonthRangeForOffset(monthOffset) {
    const thisMonthStart = getMonthStartEST();
    const [y, m] = thisMonthStart.split("-").map(Number);
    const d = new Date(y, m - 1 + monthOffset, 1);
    const startDate =
      String(d.getFullYear()) +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-01";
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const endDate =
      String(lastDay.getFullYear()) +
      "-" +
      String(lastDay.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(lastDay.getDate()).padStart(2, "0");
    return { startDate, endDate };
  }

  function formatDateRange(startDate, endDate) {
    const fmt = (str) => {
      const d = new Date(str + "T12:00:00");
      return {
        mon: d.toLocaleDateString("en-US", { month: "short" }),
        day: d.getDate(),
        year: d.getFullYear(),
      };
    };
    const s = fmt(startDate);
    const e = fmt(endDate);
    if (s.year === e.year && s.mon === e.mon) {
      return s.mon + " " + s.day + " – " + e.day + ", " + s.year;
    }
    if (s.year === e.year) {
      return s.mon + " " + s.day + " – " + e.mon + " " + e.day + ", " + s.year;
    }
    return (
      s.mon +
      " " +
      s.day +
      ", " +
      s.year +
      " – " +
      e.mon +
      " " +
      e.day +
      ", " +
      e.year
    );
  }

  function getTodayLocal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function normalizeDateString(dateStr) {
    if (!dateStr) return null;
    if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    if (dateStr instanceof Date) {
      const year = dateStr.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, "0");
      const day = String(dateStr.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    } catch (err) {}
    return dateStr;
  }

  function getGridNumberForDate(dateStr) {
    const ref = new Date(GRID_REFERENCE_DATE + "T12:00:00").getTime();
    const d = new Date(dateStr + "T12:00:00").getTime();
    const daysDiff = Math.round((d - ref) / (24 * 60 * 60 * 1000));
    return GRID_REFERENCE_NUMBER + daysDiff;
  }

  window.DateUtils = {
    getTodayEST,
    getYesterdayEST,
    getWeekStartEST,
    getMonthStartEST,
    addDaysToDate,
    getWeekRangeForOffset,
    getMonthRangeForOffset,
    formatDateRange,
    getTodayLocal,
    normalizeDateString,
    getGridNumberForDate,
  };
})();
