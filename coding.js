"use strict";

(() => {
  const data = window.CodingData;
  const calendar = window.DashboardCalendar;
  const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const ratingNumber = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 });
  const contestDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
  const contestTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit",
  });
  const dateShort = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "short", day: "numeric" });
  const weeks = 18;
  const msPerDay = 86_400_000;
  const byId = id => document.getElementById(id);
  const leaderboardMetric = byId("leaderboard-metric");
  const leaderboardPlatform = byId("leaderboard-platform");
  let solvedPlatform = leaderboardPlatform.value;
  let ratingPlatform;
  const state = { players: [], activity: {}, contests: [], contestStatus: "loading", refreshFailed: false };
  let countdownContest = null;
  let countdownDigits = [];

  function node(tag, classes, content) {
    const n = document.createElement(tag);
    if (classes) n.className = classes;
    if (content !== undefined) n.textContent = content;
    return n;
  }

  function externalLink(text, url) {
    const link = node("a", "", text);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function tag(platform) {
    return node("span", "platform-tag " + platform, data.platforms[platform].short);
  }

  const mine = () => state.players.find(player => player.name === "Chandan");
  const fmt = value => Number.isFinite(value) ? number.format(value) : "—";

  function totalSolved(player) {
    const current = Object.values(player.stats);
    return current.length ? current.reduce((sum, item) => sum + item.solved, 0) : null;
  }

  function renderProfiles() {
    const player = mine() ?? { accounts: {}, stats: {} };
    const items = Object.entries(data.platforms).map(([platform, info]) => {
      const item = node("li", "profile-card");
      item.dataset.platform = platform;
      const heading = node("div", "profile-heading");
      heading.append(tag(platform), node("h3", "", info.title));
      const handle = player.accounts[platform];
      const stats = player.stats[platform];
      item.append(heading);
      if (handle) {
        const profile = externalLink(handle, info.profile + encodeURIComponent(handle));
        profile.className = "profile-handle";
        item.append(profile);
      }
      const count = node("div", "profile-count");
      count.append(node("strong", "", fmt(stats?.solved)), node("span", "", stats ? "solved" : "awaiting data"));
      item.append(count);
      if (stats) {
        item.append(node("p", "profile-rating", stats.rating ? "Rating " + fmt(stats.rating) : "Unrated"));
      }
      if (stats?.levels) {
        const levels = node("p", "profile-levels");
        ["Easy", "Medium", "Hard"].forEach((label, index) => {
          levels.append(node("span", "", label + " " + fmt(stats.levels[index])));
        });
        item.append(levels);
      }
      if (platform === "codechef" && stats) {
        item.append(node("p", "profile-levels", "Local solve history"));
      }
      return item;
    });
    byId("coding-profiles").replaceChildren(...items);
    const solved = totalSolved(player);
    byId("coding-summary").textContent = solved == null
      ? "LeetCode, CodeChef and Codeforces"
      : fmt(solved) + " problems solved across linked profiles";
  }

  function renderLeaderboard() {
    const metric = leaderboardMetric.value;
    const platform = leaderboardPlatform.value;
    const rating = metric === "rating";
    byId("leaderboard-stat").textContent = rating ? "Rating" : "Problems solved";
    const members = state.players.length ? state.players : data.names.map(name => ({ name, stats: {} }));
    const rows = members.map(player => {
      const value = platform === "all" ? totalSolved(player) : player.stats[platform]?.[metric];
      return { player, score: Number.isFinite(value) ? value : null };
    }).sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    let previousScore;
    let rank = 0;
    byId("coding-leaderboard").replaceChildren(...rows.map(({ player, score }, index) => {
      const row = node("tr", player.name === "Chandan" ? "leaderboard-me" : "");
      if (score !== previousScore) rank = index + 1;
      previousScore = score;
      const label = node("th", "", player.name);
      label.scope = "row";
      if (player.name === "Chandan") label.append(node("span", "you-label", "You"));
      const display = score === null ? "—" : (rating ? ratingNumber : number).format(score);
      row.append(node("td", "", score === null ? "—" : rank), label, node("td", "", display));
      return row;
    }));
  }

  function switchLeaderboardMetric() {
    const rating = leaderboardMetric.value === "rating";
    leaderboardPlatform.options[0].disabled = rating;
    const defaultRatingPlatform = solvedPlatform === "all" ? "leetcode" : solvedPlatform;
    leaderboardPlatform.value = rating ? ratingPlatform ?? defaultRatingPlatform : solvedPlatform;
    renderLeaderboard();
  }

  function renderHeatmap() {
    const selected = byId("heatmap-platform").value;
    const keys = selected === "all" ? Object.keys(data.platforms) : [selected];
    const today = calendar.dayNumber(calendar.dayKey());
    const sunday = today - new Date(today * msPerDay).getUTCDay();
    const start = sunday - (weeks - 1) * 7;
    const gains = new Map();
    let first = Infinity;
    let total = 0;
    for (const platform of keys) {
      const activity = state.activity[platform];
      if (!activity?.since) continue;
      first = Math.min(first, calendar.dayNumber(activity.since));
      for (const [date, count] of Object.entries(activity.counts)) {
        const day = calendar.dayNumber(date);
        if (day >= start && day <= today) {
          gains.set(day, (gains.get(day) ?? 0) + count);
          total += count;
        }
      }
    }
    const pane = byId("coding-heatmap");
    pane.dataset.platform = selected;
    const scroll = node("div", "heat-scroll");
    const grid = node("div", "heat-grid");
    const weekdays = node("div", "heat-week heat-days");
    weekdays.append(node("span", "heat-month", ""), ...["", "Mon", "", "Wed", "", "Fri", ""].map(label => node("span", "", label)));
    grid.append(weekdays);
    const explanation = node("p", "heat-explanation", !Number.isFinite(first)
      ? (state.refreshFailed ? "Solve history is currently unavailable." : "No activity recorded for this selection.")
      : fmt(total) + " recorded in the last " + weeks + " weeks · accepted activity and local snapshots");
    for (let week = 0; week < weeks; week += 1) {
      const column = node("div", "heat-week");
      const weekStart = start + week * 7;
      const weekEnd = new Date((weekStart + 6) * msPerDay);
      const label = week === 0 || weekEnd.getUTCDate() <= 7 ? dateShort.formatToParts(weekEnd).find(part => part.type === "month").value : "";
      column.append(node("span", "heat-month", label));
      for (let row = 0; row < 7; row += 1) {
        const day = weekStart + row;
        const gain = gains.get(day) ?? 0;
        const cell = node(gain ? "button" : "span", "heat-cell");
        cell.dataset.level = day > today ? "future" : day < first ? "unknown" : gain === 0 ? "0" : gain < 2 ? "1" : gain < 4 ? "2" : gain < 7 ? "3" : "4";
        if (day <= today) cell.title = dateShort.format(day * msPerDay) + " · " + (day < first ? "No recorded history" : gain + " solved");
        if (gain) {
          cell.type = "button";
          cell.setAttribute("aria-label", cell.title);
          cell.addEventListener("click", () => { explanation.textContent = cell.title; });
        }
        column.append(cell);
      }
      grid.append(column);
    }
    scroll.append(grid);
    const legend = node("div", "heat-key");
    legend.append(node("span", "", "Less"));
    for (let level = 0; level <= 4; level += 1) {
      const cell = node("i", "heat-cell");
      cell.dataset.level = level;
      legend.append(cell);
    }
    legend.append(node("span", "", "More"));
    const footer = node("div", "heat-footer");
    footer.append(explanation, legend);
    pane.replaceChildren(scroll, footer);
    scroll.scrollLeft = scroll.scrollWidth;
  }

  const updateCalendar = calendar.mount(byId("coding-calendar"), {
    legend: Object.fromEntries(["codeforces", "leetcode", "codechef"].map(key => [key, data.platforms[key].title])),
    onDay(date, events) {
      const details = byId("coding-calendar-day");
      details.replaceChildren();
      if (!date) return;
      const list = node("ul");
      for (const event of events) {
        const item = node("li");
        const time = node("time", "", contestTime.format(event.timestamp));
        time.dateTime = event.start;
        item.append(tag(event.kind), time, externalLink(event.name, event.url));
        list.append(item);
      }
      details.append(node("h4", "", calendar.formatDay(date)), list);
    },
  });

  function prepareContests(records) {
    return records.flatMap(contest => {
      const timestamp = Date.parse(contest.start);
      if (!data.platforms[contest.platform] || !Number.isFinite(timestamp)) return [];
      try {
        const url = new URL(contest.url);
        const official = { leetcode: "leetcode.com", codechef: "codechef.com", codeforces: "codeforces.com" }[contest.platform];
        if (url.protocol !== "https:" || ![official, "www." + official].includes(url.hostname)) return [];
        return [{ ...contest, timestamp, day: calendar.dayKey(timestamp), kind: contest.platform }];
      } catch {
        return [];
      }
    }).sort((a, b) => a.timestamp - b.timestamp);
  }

  function upcoming() {
    const now = Date.now();
    return state.contests.filter(contest => contest.timestamp > now);
  }

  function renderContests() {
    const events = upcoming();
    updateCalendar(state.contests, events[0]?.day);
    const items = events.map(contest => {
      const item = node("li", "contest-entry");
      const description = node("div");
      const time = node("time", "", contestDate.format(contest.timestamp) + " · " + Math.round(contest.duration / 60) + " min");
      time.dateTime = contest.start;
      description.append(externalLink(contest.name, contest.url), time);
      item.append(tag(contest.kind), description);
      return item;
    });
    byId("contest-list").replaceChildren(...(items.length ? items : [node("li", "coding-message", state.contestStatus === "failed" ? "Contest feed unavailable." : "No upcoming contests in the feed.")]));
    renderCountdown();
  }

  function renderCountdown() {
    const next = upcoming()[0];
    const target = byId("contest-next");
    if (!next) {
      countdownContest = null;
      if (state.contestStatus !== "loading") {
        const message = state.contestStatus === "failed" ? "Contest feed unavailable." : "No upcoming contests in the feed.";
        if (target.textContent !== message) target.replaceChildren(node("p", "coding-message", message));
      }
      return;
    }
    if (countdownContest !== next) {
      countdownContest = next;
      target.dataset.platform = next.kind;
      const heading = node("div", "next-contest-name");
      heading.append(tag(next.kind), externalLink(next.name, next.url));
      const timer = node("div", "contest-timer");
      timer.setAttribute("role", "timer");
      timer.setAttribute("aria-label", "Time until " + next.name);
      countdownDigits = ["days", "hours", "min", "sec"].map(label => {
        const unit = node("div");
        const digits = node("strong");
        unit.append(digits, node("span", "", label));
        timer.append(unit);
        return digits;
      });
      target.replaceChildren(heading, timer, node("p", "contest-time", contestDate.format(next.timestamp) + " IST"));
    }
    const seconds = Math.floor((next.timestamp - Date.now()) / 1000);
    const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    countdownDigits.forEach((digit, index) => { digit.textContent = String(Math.max(0, values[index])).padStart(2, "0"); });
  }

  async function sync() {
    const status = byId("coding-sync");
    const button = byId("coding-refresh");
    button.disabled = true;
    status.textContent = "Refreshing profiles…";
    try {
      const result = await data.load();
      state.players = result.players;
      state.activity = result.activity;
      state.contests = prepareContests(result.contests);
      state.contestStatus = result.failed.filter(source => source.endsWith(" contests")).length === 3 ? "failed" : "ready";
      state.refreshFailed = result.failed.length > 0;
      status.textContent = state.refreshFailed
        ? result.failed.length + " updates unavailable"
        : "Updated " + contestDate.format(Date.parse(result.checkedAt)) + " IST";
    } catch {
      state.contestStatus = state.contests.length ? "ready" : "failed";
      state.refreshFailed = true;
      status.textContent = state.players.length ? "Refresh failed · showing saved data" : "Coding data currently unavailable";
    } finally {
      renderProfiles();
      renderLeaderboard();
      renderHeatmap();
      renderContests();
      button.disabled = false;
    }
  }

  leaderboardMetric.addEventListener("change", switchLeaderboardMetric);
  leaderboardPlatform.addEventListener("change", () => {
    if (leaderboardMetric.value === "rating") ratingPlatform = leaderboardPlatform.value;
    else solvedPlatform = leaderboardPlatform.value;
    renderLeaderboard();
  });
  byId("heatmap-platform").addEventListener("change", renderHeatmap);
  byId("coding-refresh").addEventListener("click", sync);
  setInterval(() => {
    if ((upcoming()[0] ?? null) !== countdownContest) renderContests();
    else renderCountdown();
  }, 1000);
  renderProfiles();
  renderLeaderboard();
  renderHeatmap();
  sync();
})();
