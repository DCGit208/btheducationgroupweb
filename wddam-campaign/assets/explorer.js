(function () {
  "use strict";

  var mount = document.getElementById("explorer-mount");
  var slug = document.body.getAttribute("data-sector");
  var ladder = window.WDDAM_LADDERS && window.WDDAM_LADDERS[slug];
  var campaign = window.WDDAM_CAMPAIGN;
  if (!mount || !ladder || !campaign) return;

  var LEVELS = ["L1", "L2", "L3", "L4", "L5"];
  var TUITION = [8100, 12060, 16200, 22500, 27000];
  var YEARS = [
    { name: "Year 1", focus: "Foundation & Team formation", levels: [0, 1] },
    { name: "Year 2", focus: "Professional & advanced capability", levels: [2, 3] },
    { name: "Year 3", focus: "Leadership & deployment readiness", levels: [4] }
  ];
  var state = { team: 0, level: 0 };
  var KEY_CREDS = /CABT|CBET|CHTM/;

  function scheduleOf(team) {
    var all = window.WDDAM_SCHEDULES && window.WDDAM_SCHEDULES[slug];
    return all && all[team.id] ? all[team.id] : null;
  }

  function renderTimeline(sched, level) {
    var data = sched.levels[LEVELS[state.level]];
    var wrap = el("div", "timeline-wrap");
    if (data.milestones && data.milestones.length) {
      var strip = el("ul", "milestones");
      data.milestones.forEach(function (text) {
        strip.append(el("li", KEY_CREDS.test(text) ? "is-key" : "", text));
      });
      wrap.append(strip);
    }
    var grid = el("div", "timeline");
    var kinds = [["c", "Complete", "is-complete"], ["s", "Start", "is-start"], ["k", "Continue", "is-continue"]];
    data.years.forEach(function (year, index) {
      var col = el("article", "tl-year");
      col.append(el("p", "tl-year-name", "Year " + (index + 1)));
      if (year.cnt) col.append(el("p", "tl-count", "Certifications: " + year.cnt));
      if (year.t) col.append(el("h5", "tl-theme", year.t));
      kinds.forEach(function (kind) {
        var items = year[kind[0]];
        if (!items || !items.length) return;
        var group = el("div", "tl-group " + kind[2]);
        group.append(el("span", "tl-badge", kind[1]));
        var list = el("ul", "tl-list");
        items.forEach(function (text) {
          list.append(el("li", KEY_CREDS.test(text) && kind[0] === "c" ? "is-key" : "", text));
        });
        group.append(list);
        col.append(group);
      });
      (year.n || []).forEach(function (text) { col.append(el("p", "tl-note", text)); });
      if (year.dev) {
        var dev = el("p", "tl-dev");
        dev.append(el("strong", "", "Specialty development: "));
        dev.append(document.createTextNode(year.dev));
        col.append(dev);
      }
      grid.append(col);
    });
    wrap.append(grid);
    if (data.htm) {
      var htm = el("p", "tl-htm");
      htm.append(el("strong", "", "HTM competencies at " + LEVELS[state.level] + ": "));
      htm.append(document.createTextNode(data.htm));
      wrap.append(htm);
    }
    return wrap;
  }

  function yearOf(levelIndex) {
    return YEARS.findIndex(function (year) { return year.levels.indexOf(levelIndex) !== -1; });
  }

  function yearCertCount(team, year) {
    if (ladder.portfolio) return ladder.portfolio.groups[Math.min(yearOf(year.levels[0]), ladder.portfolio.groups.length - 1)].items.length;
    var seen = [];
    year.levels.forEach(function (index) {
      (team.levels[index].certifications || []).forEach(function (cert) {
        if (seen.indexOf(cert) === -1) seen.push(cert);
      });
    });
    return seen.length;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function money(value) {
    return "$" + Number(value).toLocaleString("en-US");
  }

  function mail(subject, body) {
    return "mailto:" + campaign.routes.workforceEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var team = parseInt(params.get("team"), 10);
    var level = LEVELS.indexOf(params.get("level"));
    if (team >= 1 && team <= ladder.teams.length) state.team = team - 1;
    if (level >= 0) state.level = level;
    return params.has("team") || params.has("level");
  }

  function writeUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set("team", String(state.team + 1));
    url.searchParams.set("level", LEVELS[state.level]);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function chips(list, className) {
    var wrap = el("ul", "chip-list" + (className ? " " + className : ""));
    list.forEach(function (item) {
      wrap.append(el("li", "chip", item));
    });
    return wrap;
  }

  function block(title, content) {
    var section = el("section", "level-block");
    section.append(el("h4", "", title));
    section.append(content);
    return section;
  }

  function renderPay() {
    var base = TUITION[state.level];
    var card = el("aside", "market-card");
    card.setAttribute("aria-label", "WDDAM monthly portfolio value");
    card.append(el("p", "eyebrow", "WDDAM Market Portfolio · " + LEVELS[state.level]));
    card.append(el("h4", "", "Monthly portfolio value"));
    var bar = el("div", "pay-bar");
    var marker = el("span", "pay-median");
    marker.style.left = "50%";
    bar.append(marker);
    card.append(bar);
    var figures = el("div", "pay-figures");
    [["Base", base], ["Median · 2×", base * 2], ["Upper · 3×", base * 3]].forEach(function (pair, index) {
      var item = el("div", index === 1 ? "pay-figure is-median" : "pay-figure");
      item.append(el("strong", "", money(pair[1])));
      item.append(el("span", "", pair[0] + " / month"));
      figures.append(item);
    });
    card.append(figures);
    card.append(el("p", "market-note", "Base value is the Level " + (state.level + 1) + " development value of " + money(base) + " per month in the WDDAM Market Portfolio. Median and upper values apply 2× and 3× as capability and deployment responsibility grow."));
    card.append(el("p", "market-source", "WDDAM Market Portfolio reference. Not a guaranteed wage, placement or employment offer."));
    return card;
  }

  function renderPortfolio(group) {
    var wrap = el("div", "portfolio");
    var part = el("div", "portfolio-group");
    part.append(el("h5", "", group.name));
    part.append(chips(group.items));
    wrap.append(part);
    wrap.append(el("p", "portfolio-note", ladder.portfolio.note));
    return wrap;
  }

  function renderRoadmap(team, yearIndex) {
    var year = YEARS[yearIndex];
    var wrap = el("div", "roadmap");
    if (ladder.portfolio) {
      var group = ladder.portfolio.groups[Math.min(yearIndex, ladder.portfolio.groups.length - 1)];
      wrap.append(renderPortfolio(group));
      return wrap;
    }
    year.levels.forEach(function (index) {
      var row = el("div", "roadmap-row" + (index === state.level ? " is-current" : ""));
      row.append(el("h5", "", LEVELS[index] + " · " + team.levels[index].positioning));
      var certs = team.levels[index].certifications || [];
      if (certs.length) row.append(chips(certs, "chips-cert"));
      else row.append(el("p", "muted", "No additional external certification is specified at this level in the sector document; progression is evidenced through the approved assessment."));
      wrap.append(row);
    });
    return wrap;
  }

  function renderLevel(team, panel) {
    var level = team.levels[state.level];
    panel.replaceChildren();

    var head = el("header", "level-head");
    var sched = scheduleOf(team);
    head.append(el("p", "eyebrow", (sched ? "3-year schedule" : YEARS[yearOf(state.level)].name) + " · " + LEVELS[state.level] + " · " + level.positioning));
    head.append(el("h3", "", level.title));
    panel.append(head);

    var grid = el("div", "level-grid");
    var main = el("div", "level-main");

    if (level.focus && level.focus.length) {
      var list = el("ul", "tick-list");
      level.focus.forEach(function (item) { list.append(el("li", "", item)); });
      main.append(block("What you develop at this level", list));
    }

    var yearIndex = yearOf(state.level);
    if (sched) {
      main.append(block(LEVELS[state.level] + " certifications by year", renderTimeline(sched, level)));
    } else {
      main.append(block(YEARS[yearIndex].name + " certification roadmap", renderRoadmap(team, yearIndex)));
    }

    if (!sched && !ladder.portfolio && YEARS[yearIndex].levels[0] > 0) {
      var earlier = [];
      var yearStart = YEARS[yearIndex].levels[0];
      for (var index = 0; index < yearStart; index += 1) {
        (team.levels[index].certifications || []).forEach(function (cert) {
          if (earlier.indexOf(cert) === -1) earlier.push(cert);
        });
      }
      if (earlier.length) {
        var details = el("details", "builds-on");
        details.append(el("summary", "", "Builds on " + earlier.length + " credentials from earlier years"));
        details.append(chips(earlier, "chips-muted"));
        main.append(details);
      }
    }
    grid.append(main);

    var side = el("div", "level-side");
    if (level.positions && level.positions.length) {
      var roles = el("ul", "role-list");
      level.positions.forEach(function (position) {
        var item = el("li", "");
        item.append(el("strong", "", position.title));
        item.append(el("span", "", position.count + (position.count === 1 ? " position per Team" : " positions per Team")));
        roles.append(item);
      });
      side.append(block("Roles in the Team", roles));
    }
    side.append(renderPay());
    grid.append(side);
    panel.append(grid);

    var cta = el("div", "level-cta");
    var link = el("a", "btn btn-gold", "Ask about " + team.name + " · " + LEVELS[state.level] + " →");
    link.href = mail(
      "WDDAM Cohort 01 — " + ladder.sector + " — " + team.name + " — " + LEVELS[state.level],
      "Hello,\n\nI am interested in the " + team.name + " Team (" + LEVELS[state.level] + ") in the WDDAM™ " + ladder.sector + " Cohort 01 pathway. Please share the approved next step.\n\nThank you."
    );
    cta.append(link);
    cta.append(el("span", "muted", "Opens an email — not a formal application or job offer."));
    panel.append(cta);
  }

  function render() {
    var team = ladder.teams[state.team];
    mount.replaceChildren();

    var tabs = el("div", "team-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Specialized Teams");
    ladder.teams.forEach(function (item, index) {
      var tab = el("button", "team-tab");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(index === state.team));
      tab.append(el("span", "team-tab-index", "0" + (index + 1)));
      tab.append(el("span", "team-tab-name", item.name));
      tab.addEventListener("click", function () {
        state.team = index;
        writeUrl();
        render();
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (index + 1) % ladder.teams.length;
        if (event.key === "ArrowLeft") next = (index + ladder.teams.length - 1) % ladder.teams.length;
        if (next === null) return;
        event.preventDefault();
        state.team = next;
        writeUrl();
        render();
        mount.querySelectorAll(".team-tab")[next].focus();
      });
      tabs.append(tab);
    });
    mount.append(tabs);

    var intro = el("div", "team-intro");
    intro.append(el("h3", "", team.name));
    intro.append(el("p", "", team.summary));
    mount.append(intro);

    var steps = el("div", "year-steps");
    steps.setAttribute("aria-label", "Three-year pathway");
    var sched = scheduleOf(team);
    if (sched) {
      steps.className = "level-select";
      steps.setAttribute("aria-label", "Levels");
      LEVELS.forEach(function (name, index) {
        var button = el("button", "level-step" + (index <= state.level ? " is-reached" : ""));
        button.type = "button";
        button.setAttribute("aria-pressed", String(index === state.level));
        button.append(el("span", "level-step-name", name));
        button.append(el("span", "level-step-label", team.levels[index].positioning));
        button.append(el("span", "level-step-end", "→ " + sched.levels[name].end));
        button.addEventListener("click", function () {
          state.level = index;
          writeUrl();
          render();
        });
        steps.append(button);
      });
    } else YEARS.forEach(function (year) {
      var group = el("div", "year-group");
      group.style.flexGrow = String(year.levels.length);
      var count = yearCertCount(team, year);
      var head = el("div", "year-head");
      head.append(el("strong", "", year.name));
      head.append(el("span", "", year.focus));
      head.append(el("em", "", count + (ladder.portfolio ? " credentials in portfolio" : count === 1 ? " certification" : " certifications")));
      group.append(head);
      var row = el("div", "level-steps");
      year.levels.forEach(function (index) {
        var button = el("button", "level-step" + (index <= state.level ? " is-reached" : ""));
        button.type = "button";
        button.setAttribute("aria-pressed", String(index === state.level));
        button.append(el("span", "level-step-name", LEVELS[index]));
        button.append(el("span", "level-step-label", team.levels[index].positioning));
        button.addEventListener("click", function () {
          state.level = index;
          writeUrl();
          render();
        });
        row.append(button);
      });
      group.append(row);
      steps.append(group);
    });
    mount.append(steps);

    var panel = el("div", "level-panel");
    panel.setAttribute("aria-live", "polite");
    renderLevel(team, panel);
    mount.append(panel);
  }

  var fromUrl = readUrl();
  render();
  if (fromUrl) {
    var target = document.getElementById("teams");
    if (target) target.scrollIntoView();
  }
}());
