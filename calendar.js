"use strict";

(() => {
  const utcDay = 86_400_000;
  const zone = "Asia/Kolkata";
  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const monthLabel = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long", year: "numeric" });
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  function dayKey(time = Date.now()) {
    const parts = Object.fromEntries(localDate.formatToParts(new Date(time)).map(({ type, value }) => [type, value]));
    return parts.year + "-" + parts.month + "-" + parts.day;
  }

  const dayNumber = key => Date.parse(key + "T00:00:00Z") / utcDay;
  const keyForDay = number => new Date(number * utcDay).toISOString().slice(0, 10);
  const formatDay = key => dateLabel.format(dayNumber(key) * utcDay);

  function node(tag, css, text) {
    const element = document.createElement(tag);
    if (css) element.className = css;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function mount(root, { legend, onDay }) {
    let month = new Date(dayKey().slice(0, 7) + "-01T00:00:00Z");
    let selected = null;
    let eventsByDay = new Map();
    const heading = node("div", "cal-head");
    const monthName = node("span");
    monthName.setAttribute("aria-live", "polite");
    const previous = node("button", "cal-nav", "‹");
    const next = node("button", "cal-nav", "›");
    previous.type = next.type = "button";
    previous.setAttribute("aria-label", "Previous month");
    next.setAttribute("aria-label", "Next month");
    heading.append(previous, monthName, next);
    const grid = node("div", "cal-grid");
    const legendBar = node("div", "cal-legend");
    for (const [kind, label] of Object.entries(legend)) {
      const item = node("span");
      const mark = node("b", "cal-mark " + kind);
      mark.setAttribute("aria-hidden", "true");
      item.append(mark, document.createTextNode(label));
      legendBar.append(item);
    }
    root.append(heading, grid, legendBar);

    function render(focusDate) {
      monthName.textContent = monthLabel.format(month);
      const weekday = month.getUTCDay();
      const nextMonth = Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1);
      const monthDays = (nextMonth - month.getTime()) / utcDay;
      const cellCount = Math.ceil((weekday + monthDays) / 7) * 7;
      const firstCell = month.getTime() / utcDay - weekday;
      const monthKey = month.toISOString().slice(0, 7);
      const today = dayKey();
      const contents = document.createDocumentFragment();
      for (const day of ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]) contents.append(node("span", "dow", day));
      let focus;

      for (let index = 0; index < cellCount; index += 1) {
        const key = keyForDay(firstCell + index);
        const events = eventsByDay.get(key) ?? [];
        const cell = node(events.length ? "button" : "span", "cal-cell");
        if (key.slice(0, 7) !== monthKey) cell.classList.add("out");
        if (key === today) {
          cell.classList.add("today");
          cell.setAttribute("aria-current", "date");
        }
        cell.append(node("span", "", Number(key.slice(-2))));
        const marks = node("span", "marks");
        marks.setAttribute("aria-hidden", "true");
        for (const kind of new Set(events.map(event => event.kind))) marks.append(node("b", "cal-mark " + kind));
        cell.append(marks);
        if (events.length) {
          cell.type = "button";
          cell.classList.add("has");
          cell.classList.toggle("sel", key === selected);
          cell.setAttribute("aria-pressed", String(key === selected));
          cell.setAttribute("aria-label", formatDay(key) + " · " + events.length + (events.length === 1 ? " event" : " events"));
          cell.title = events.map(event => event.name).join("\n");
          cell.addEventListener("click", () => {
            selected = selected === key ? null : key;
            render(key);
          });
        }
        if (key === focusDate) focus = cell;
        contents.append(cell);
      }
      grid.replaceChildren(contents);
      onDay(selected, eventsByDay.get(selected) ?? []);
      focus?.focus();
    }

    function move(offset) {
      month = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + offset, 1));
      render();
    }

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    return function update(events, initialSelection) {
      eventsByDay = new Map();
      for (const event of events) {
        if (!eventsByDay.has(event.day)) eventsByDay.set(event.day, []);
        eventsByDay.get(event.day).push(event);
      }
      if (initialSelection && !selected) {
        selected = initialSelection;
        month = new Date(selected.slice(0, 7) + "-01T00:00:00Z");
      }
      if (!eventsByDay.has(selected)) selected = null;
      render();
    };
  }

  window.DashboardCalendar = { mount, dayKey, dayNumber, keyForDay, formatDay };
})();
