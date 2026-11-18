"use strict";

const bank = window.CAT_QUESTION_BANK;
const dayLength = 86_400_000;
const firstDay = Date.parse(bank.releaseDate + "T00:00:00Z") / dayLength;
const lastDay = firstDay + bank.sets.length - 1;
const indiaDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata", year: "numeric", month: "numeric", day: "numeric",
});
const fullDate = new Intl.DateTimeFormat("en-IN", {
  timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric",
});
const shortDate = new Intl.DateTimeFormat("en-IN", {
  timeZone: "UTC", weekday: "short", day: "numeric", month: "short",
});
const sectionNames = {
  QA: "Quantitative Aptitude",
  DILR: "Data Interpretation and Logical Reasoning",
  VARC: "Verbal Ability and Reading Comprehension",
};

function currentDay(now = new Date()) {
  const parts = Object.fromEntries(indiaDate.formatToParts(now).map(({ type, value }) => [type, value]));
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) / dayLength;
}

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

const ui = Object.fromEntries([
  "hero-date", "page-title", "hero-summary", "schedule-tab", "today-tab",
  "schedule-view", "schedule-status", "schedule-list", "practice-view",
  "question-list", "solutions", "solution-list", "toggle-solutions", "prev-day",
  "next-day", "selected-date", "progress-text", "progress-bar", "question-grid",
].map(id => [id, document.getElementById(id)]));

let today = currentDay();
let selectedDay = today;
let viewingSchedule = false;
let selections = {};
let selectionKey = "";
let pendingRevision = null;
let cards = [];

function storageKey(set, day) {
  return "cat-prep:" + set.id + ":" + day;
}

function readStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep practice usable when local storage is unavailable.
  }
}

function readSelections(key) {
  const values = readStored(key);
  if (!values || typeof values !== "object" || Array.isArray(values)) return {};
  return Object.fromEntries(Object.entries(values).filter(([key, value]) => /^\d+$/.test(key) && typeof value === "string"));
}

function responseStatus(question, value) {
  const answer = value?.trim().replaceAll("−", "-") ?? "";
  if (!answer) return "skipped";
  if (question.options) return answer === String(question.correct) ? "correct" : "incorrect";
  const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  return numeric.test(answer) && Number(answer) === Number(question.correct) ? "correct" : "incorrect";
}

function buildRevision(set) {
  const key = storageKey(set, lastDay) + ":plan";
  const previousSets = bank.sets.slice(0, -1);
  const qa = [];
  const varc = [];
  const dilr = [];

  previousSets.forEach((daySet, dayIndex) => {
    const responses = readSelections(storageKey(daySet, firstDay + dayIndex));
    const hasPractice = Object.values(responses).some(value => value.trim());
    let number = 0;
    for (const group of daySet.groups) {
      const entries = group.questions.map(question => ({
        question,
        status: responseStatus(question, responses[++number]),
      }));
      if (group.section === "DILR") {
        const weight = { correct: 0, skipped: 1, incorrect: 2 };
        const difficulty = hasPractice
          ? entries.reduce((sum, entry) => sum + weight[entry.status], 0)
          : 0.5;
        dilr.push({ group, difficulty });
      } else {
        const pool = group.section === "QA" ? qa : varc;
        const rank = { incorrect: 0, skipped: hasPractice ? 1 : 2, correct: 3 };
        pool.push(...entries.map(entry => ({
          question: { ...entry.question, originalDay: dayIndex + 1 },
          priority: rank[entry.status],
        })));
      }
    }
  });

  const saved = readStored(key);
  const validList = (items, count, length) => Array.isArray(items) && items.length === count
    && new Set(items).size === count && items.every(index => Number.isInteger(index) && index >= 0 && index < length);
  const validPlan = saved && validList(saved.qa, 5, qa.length) && validList(saved.varc, 2, varc.length)
    && Number.isInteger(saved.dilr) && saved.dilr >= 0 && saved.dilr < dilr.length;
  function select(pool, count) {
    return pool.map((item, index) => ({ index, priority: item.priority }))
      .sort((left, right) => left.priority - right.priority)
      .slice(0, count).map(item => item.index);
  }
  const plan = validPlan ? saved : {
    qa: select(qa, 5),
    dilr: dilr.reduce((hardest, entry, index) => entry.difficulty > dilr[hardest].difficulty ? index : hardest, 0),
    varc: select(varc, 2),
  };
  const dilrGroup = dilr[plan.dilr].group;
  if (!validPlan) pendingRevision = { key, plan };
  return {
    ...set,
    groups: [
      { section: "QA", minutes: 12, questions: plan.qa.map(index => qa[index].question) },
      { ...dilrGroup, questions: dilrGroup.questions.map(question => ({ ...question, originalDay: plan.dilr + 1 })) },
      { section: "VARC", minutes: 5, questions: plan.varc.map(index => varc[index].question) },
    ],
  };
}

function saveSelection(number, value) {
  selections[number] = value;
  if (pendingRevision && value.trim()) {
    writeStored(pendingRevision.key, pendingRevision.plan);
    pendingRevision = null;
  }
  writeStored(selectionKey, selections);
  updateProgress();
}

function questionCard(question, section, number) {
  const card = element("article", "question-card");
  card.id = "question-" + number;
  card.tabIndex = -1;

  const meta = element("div", "question-meta");
  const tag = element("span", "tag", section);
  meta.append(element("span", "number", "Q" + String(number).padStart(2, "0")), tag);
  if (question.topic) meta.append(element("span", "question-topic", question.topic));
  if (question.originalDay) meta.append(element("span", "question-origin", "From Day " + question.originalDay));

  const field = element("fieldset");
  field.append(element("legend", "", question.prompt));
  if (question.options?.length) {
    const choices = element("div", "choices");
    question.options.forEach((option, index) => {
      const row = element("label", "choice");
      const input = element("input");
      input.type = "radio";
      input.name = "response-" + number;
      input.value = String(index);
      input.checked = selections[number] === input.value;
      input.addEventListener("change", () => saveSelection(number, input.value));
      const letter = element("span", "choice-letter", String.fromCharCode(65 + index));
      row.append(input, letter, element("span", "choice-copy", option));
      choices.append(row);
    });
    field.append(choices);
  } else {
    const input = element("input");
    input.type = "text";
    input.placeholder = "Enter your answer";
    input.setAttribute("aria-label", "Your answer to question " + number);
    input.autocomplete = "off";
    input.inputMode = "decimal";
    input.value = selections[number] ?? "";
    input.addEventListener("input", () => saveSelection(number, input.value));
    field.append(input);
  }
  card.append(meta, field);
  return card;
}

function solutionCard(question, number, feedback) {
  const card = element("details");
  const summary = element("summary");
  summary.append(
    element("span", "solution-number", "Q" + String(number).padStart(2, "0")),
    element("span", "solution-topic", question.topic),
  );
  card.append(summary);
  const body = element("div", "solution-body");
  body.append(
    element("strong", "answer", question.answer),
    feedback,
    element("p", "worked-solution", question.solution),
  );
  card.append(body);
  card.addEventListener("toggle", updateSolutionToggle);
  return card;
}

function contextCard(group) {
  const card = element("section", "context-card");
  card.append(element("h4", "", group.title), element("p", "", group.context));
  if (group.table) {
    const grid = element("div", "table-wrap");
    const table = element("table", "context-table");
    table.setAttribute("aria-label", group.title);
    const header = element("thead");
    const headerRow = element("tr");
    for (const title of group.table.headers) {
      const cell = element("th", "", title);
      cell.scope = "col";
      headerRow.append(cell);
    }
    header.append(headerRow);
    const body = element("tbody");
    for (const values of group.table.rows) {
      const row = element("tr");
      row.append(...values.map(value => element("td", "", value)));
      body.append(row);
    }
    table.append(header, body);
    grid.append(table);
    card.append(grid);
  }
  return card;
}

function updateSolutionToggle() {
  const solutions = [...ui["solution-list"].children];
  ui["toggle-solutions"].textContent = solutions.every(item => item.open) ? "Hide all" : "Show all";
}

function updateProgress() {
  let answered = 0;
  cards.forEach(({ link, question, feedback }, index) => {
    const number = index + 1;
    const value = selections[number];
    const status = responseStatus(question, value);
    const hasResponse = status !== "skipped";
    if (hasResponse) answered += 1;
    link.classList.toggle("answered", hasResponse);
    link.setAttribute("aria-label", "Question " + number + (hasResponse ? ", answered" : ", unanswered"));
    if (!hasResponse) {
      feedback.textContent = "Skipped";
    } else if (status === "correct") {
      feedback.textContent = "You answered correctly.";
    } else {
      const choice = question.options?.[Number(value)];
      feedback.textContent = "You entered " + (choice ? String.fromCharCode(65 + Number(value)) + ". " + choice : value.trim()) + ".";
    }
  });
  ui["progress-bar"].max = Math.max(1, cards.length);
  ui["progress-bar"].value = answered;
  ui["progress-text"].textContent = answered + " / " + cards.length;
}

function openPractice(day) {
  selectedDay = day;
  viewingSchedule = false;
  render();
  ui["page-title"].focus();
}

function renderSchedule() {
  ui["schedule-status"].textContent = today < firstDay
    ? "Day 1 opens 19 November at midnight IST"
    : today > lastDay ? "All 10 days are open for review" : "New sets open at midnight IST";
  const list = document.createDocumentFragment();
  bank.sets.forEach((set, index) => {
    const day = firstDay + index;
    const date = new Date(day * dayLength);
    const released = day <= today;
    const item = element("li", "plan-item");
    const card = element(released ? "button" : "div", "plan-card");
    if (released) {
      card.type = "button";
      card.addEventListener("click", () => openPractice(day));
    }
    const meta = element("span", "plan-meta");
    const dayNumber = element("span", "plan-day", "Day " + String(index + 1).padStart(2, "0"));
    const time = element("time", "plan-date", shortDate.format(date));
    time.dateTime = date.toISOString().slice(0, 10);
    meta.append(dayNumber, time);
    const title = element("span", "plan-focus");
    title.append(element("span", "", set.focus));
    if (released) {
      const arrow = element("span", "plan-arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      title.append(arrow);
    }
    card.append(window.createPlanArtwork(index), meta, title);
    item.append(card);
    list.append(item);
  });
  ui["schedule-list"].replaceChildren(list);
}

function render() {
  pendingRevision = null;
  const scheduled = viewingSchedule ? undefined : bank.sets[selectedDay - firstDay];
  const set = scheduled?.revision ? buildRevision(scheduled) : scheduled;
  const isToday = Boolean(set && selectedDay === today);
  ui["schedule-view"].hidden = Boolean(set);
  ui["practice-view"].hidden = !set;
  ui["today-tab"].disabled = today < firstDay || today > lastDay;
  ui["schedule-tab"].setAttribute("aria-current", set ? "false" : "page");
  ui["today-tab"].setAttribute("aria-current", isToday ? "page" : "false");
  cards = [];
  selections = {};

  if (!set) {
    ui["hero-date"].textContent = "19–28 November 2026";
    ui["page-title"].textContent = "The CAT practice plan";
    ui["hero-summary"].textContent = "Ten questions a day, with answers and worked solutions.";
    renderSchedule();
    return;
  }

  const date = new Date(selectedDay * dayLength);
  ui["hero-date"].textContent = "Day " + (selectedDay - firstDay + 1) + " of 10 · " + fullDate.format(date);
  ui["page-title"].textContent = set.revision ? "Revision day" : set.focus;
  ui["hero-summary"].textContent = set.revision
    ? "Ten questions from Days 1–9, with missed and skipped questions first."
    : "Ten CAT-style questions with worked solutions.";
  ui["selected-date"].textContent = shortDate.format(date);
  ui["prev-day"].disabled = selectedDay <= firstDay;
  ui["next-day"].disabled = selectedDay >= Math.min(today, lastDay);
  selectionKey = storageKey(set, selectedDay);
  selections = readSelections(selectionKey);

  const questions = document.createDocumentFragment();
  const solutions = document.createDocumentFragment();
  const grid = document.createDocumentFragment();
  for (const group of set.groups) {
    const heading = element("div", "group-heading");
    heading.append(
      element("h3", "", sectionNames[group.section]),
      element("span", "", group.questions.length + " questions · " + group.minutes + " min"),
    );
    questions.append(heading);
    if (group.context) questions.append(contextCard(group));
    for (const question of group.questions) {
      const number = cards.length + 1;
      const card = questionCard(question, group.section, number);
      const link = element("a", "", number);
      link.href = "#" + card.id;
      const feedback = element("p", "response-feedback");
      questions.append(card);
      solutions.append(solutionCard(question, number, feedback));
      grid.append(link);
      cards.push({ link, question, feedback });
    }
  }
  ui["question-list"].replaceChildren(questions);
  ui["solution-list"].replaceChildren(solutions);
  ui["question-grid"].replaceChildren(grid);
  updateProgress();
  updateSolutionToggle();
}

ui["toggle-solutions"].addEventListener("click", () => {
  const solutions = [...ui["solution-list"].children];
  const show = solutions.some(item => !item.open);
  solutions.forEach(item => { item.open = show; });
  updateSolutionToggle();
});

ui["prev-day"].addEventListener("click", () => {
  selectedDay = Math.min(selectedDay - 1, lastDay);
  render();
});
ui["next-day"].addEventListener("click", () => {
  selectedDay += 1;
  render();
});
ui["schedule-tab"].addEventListener("click", () => {
  viewingSchedule = true;
  render();
  ui["page-title"].focus();
});
ui["today-tab"].addEventListener("click", () => openPractice(today));

function refreshToday() {
  const newDay = currentDay();
  if (today === newDay) return;
  if (selectedDay === today || selectedDay > newDay) selectedDay = newDay;
  today = newDay;
  render();
}

document.addEventListener("visibilitychange", refreshToday);
setInterval(refreshToday, 60_000);
render();
